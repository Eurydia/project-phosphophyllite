/// API: https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue
///
#[tauri::command(rename_all = "camelCase")]
pub async fn post_issue(
    _: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
    owner_name: String,
    repository_name: String,
    body: String,
) -> Result<(), &'static str> {
    let crate::models::AppRepository {
        url: repository_url,
        ..
    } = match crate::database::get::get_repository_with_full_name(
        state.to_owned(),
        owner_name.to_owned(),
        repository_name.to_owned(),
    )
    .await
    {
        Err(err) => return Err(err),
        Ok(option) => match option {
            Some(repository) => repository,
            None => {
                log::error!(
                    "Cannot find repository with full name: \"{}/{}\"",
                    &owner_name,
                    &repository_name
                );
                return Err("Cannot find repository");
            }
        },
    };

    let issues =
        crate::database::get::get_issues_in_repository(state.to_owned(), repository_url).await?;
    let issue_count = issues.len();
    let title = format!("Issue #{}", issue_count + 1);

    let new_issue = match state
        .octocrab
        .issues(owner_name, repository_name)
        .create(title)
        .body(body)
        .send()
        .await
    {
        Ok(issue) => issue,
        Err(err) => {
            log::error!("Octocrab cannot create issue: \"{}\"", dbg!(err));
            return Err("Cannot create issue");
        }
    };
    crate::database::update::update_issue_table_entry(&state.db, &new_issue).await
}
