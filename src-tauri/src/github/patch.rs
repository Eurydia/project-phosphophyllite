/// https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#update-an-issue
#[tauri::command(rename_all = "camelCase")]
pub async fn patch_issue(
    state: tauri::State<'_, crate::AppState>,
    owner_name: String,
    repository_name: String,
    issue_number: u64,
    title: String,
    labels: Vec<String>,
    issue_state: String,
) -> Result<(), &'static str> {
    let issue_state_req = {
        match issue_state.as_str() {
            "open" => octocrab::models::IssueState::Open,
            "closed" => octocrab::models::IssueState::Closed,
            _ => return Err("Unknown issue state"),
        }
    };

    let request = state
        .octocrab
        .issues(owner_name, repository_name)
        .update(issue_number)
        .title(&title)
        .labels(&labels)
        .state(issue_state_req)
        .send()
        .await;

    let issue = match request {
        Ok(respond) => respond,
        Err(err) => {
            log::error!("Octocrab cannot patch issue: \"{}\"", err);
            return Err("Cannot patch issue");
        }
    };

    crate::database::update::update_issue_table_entry(&state.db, &issue).await
}

/// https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#update-an-issue
#[tauri::command(rename_all = "camelCase")]
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
        .update(issue_number)
        .body(&body)
        .send()
        .await;

    let issue = match request {
        Ok(respond) => respond,
        Err(err) => {
            log::error!("Octocrab cannot patch issue body: \"{}\"", err);
            return Err("Cannot patch issue body");
        }
    };

    crate::database::update::update_issue_table_entry(&state.db, &issue).await
}
