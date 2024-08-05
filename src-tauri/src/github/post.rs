/// API: https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#create-an-issue
#[tauri::command(rename_all = "camelCase")]
pub async fn post_issue(
    state: tauri::State<'_, crate::AppState>,
    owner_name: String,
    repository_name: String,
    body: String,
) -> Result<(), &'static str> {
    let request = state
        .octocrab
        .issues(owner_name, repository_name)
        .create("New issue")
        .body(body)
        .send();

    let issue = match request.await {
        Ok(issue) => issue,
        Err(err) => {
            log::error!("Octocrab cannot post issue: \"{}\"", dbg!(err));
            return Err("Cannot post issue");
        }
    };

    crate::database::update::update_issue_table_entry(&state.db, &issue).await
}

/// https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#create-an-issue-comment
#[tauri::command(rename_all = "camelCase")]
pub async fn post_comment(
    state: tauri::State<'_, crate::AppState>,
    owner_name: String,
    repository_name: String,
    issue_number: u64,
    body: String,
) -> Result<(), &'static str> {
    let request = state
        .octocrab
        .issues(&owner_name, &repository_name)
        .create_comment(&issue_number, &body)
        .send()
        .await?;

    let comment = match request.await {
        Ok(comment) => comment,
        Err(err) => {
            log::error!("Octocrab cannot post comment: \"{}\"", err);
            return Err("Cannot post comment");
        }
    };

    crate::database::update::update_comment_table_entry(&state.db, &comment).await
}
