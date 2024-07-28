/// Updates the README of a repository but also create one if there is none.
///
/// [API documentation](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents)
#[tauri::command]
pub async fn put_repository_readme(
    _: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
    owner_name: String,
    repository_name: String,
    unencoded_content: String,
    commit_message: String,
) -> Result<(), String> {
    let crab = state.octocrab.repos(owner_name, repository_name);

    let repository = crab.get().await.map_err(|err| err.to_string())?;
    let octocrab::models::repos::Content { sha, path, .. } = crab
        .get_readme()
        .send()
        .await
        .map_err(|err| err.to_string())?;

    crab.update_file(path, commit_message, unencoded_content, sha)
        .send()
        .await
        .map_err(|err| err.to_string())?;

    crate::database::update::update_repository_table_entry(&state.db, &state.octocrab, repository)
        .await
}
