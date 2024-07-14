#[tauri::command]
pub async fn put_repository_readme(
    _: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
    owner_name: String,
    repository_name: String,
    content: String,
    commit_message: String,
) -> Result<(), String> {
    // https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents
    let octocrab = state.octocrab.repos(owner_name, repository_name);

    let octocrab::models::repos::Content { sha, path, .. } = octocrab
        .get_readme()
        .send()
        .await
        .map_err(|err| err.to_string())?;

    octocrab
        .update_file(path, commit_message, content, sha)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    let repository = octocrab.get().await.map_err(|err| err.to_string())?;
    crate::database::update::update_repository_table_entry(&state.db, &state.octocrab, repository)
        .await
}
