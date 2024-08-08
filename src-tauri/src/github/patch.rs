/// Updates the description of a repository.
///
/// [API documentation](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#update-a-repository)
///
/// # Error
/// - [`octocrab`] cannot update description
/// - [`crate::database::update::update_repository_table_entry`] cannot update repository table entry
#[tauri::command(rename_all = "camelCase")]
pub async fn patch_repository_description(
    state: tauri::State<'_, crate::AppState>,
    owner_name: String,
    repository_name: String,
    description: String,
) -> Result<(), &'static str> {
    let request_body = serde_json::json!({"description": description});

    let repository = match state
        .octocrab
        .patch::<octocrab::models::Repository, _, serde_json::value::Value>(
            format!("/repos/{}/{}", owner_name, repository_name),
            Some(&request_body),
        )
        .await
    {
        Ok(repo) => repo,
        Err(err) => {
            log::error!("Octocrab cannot update description: \"{}\"", err);
            return Err("Cannot update description");
        }
    };

    crate::database::update::update_repository_table_entry(&state.db, &state.octocrab, &repository)
        .await
}

/// https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#update-an-issue
#[tauri::command(rename_all = "camelCase")]
pub async fn patch_issue_title(
    state: tauri::State<'_, crate::AppState>,
    owner_name: String,
    repository_name: String,
    issue_number: u64,
    title: String,
) -> Result<(), &'static str> {
    let request = state
        .octocrab
        .issues(&owner_name, &repository_name)
        .update(&issue_number)
        .title(&title)
        .send()
        .await?;

    let issue = match request.await {
        Ok(issue) => issue,
        Err(err) => {
            log::error!("Octocrab cannot update title: \"{}\"", err);
            return Err("Cannot update title");
        }
    };

    crate::database::update::update_issue_table_entry(&state.db, &issue).await
}

// https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#update-an-issue
pub async fn patch_issue_body(
    state: tauri::State<'_, crate::AppState>,
    owner_name: String,
    repository_name: String,
    issue_number: u64,
    body: String,
) -> Result<(), &'static str> {
    let request = state
        .octocrab
        .issues(&owner_name, &repository_name)
        .update(&issue_number)
        .body(&body)
        .send()
        .await?;

    let issue = match request.await {
        Ok(issue) => issue,
        Err(err) => {
            log::error!("Octocrab cannot update body: \"{}\"", err);
            return Err("Cannot update body");
        }
    };

    crate::database::update::update_issue_table_entry(&state.db, &issue).await
}
