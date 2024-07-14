#[tauri::command]
pub async fn patch_repository_description(
    _: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
    owner_name: String,
    repository_name: String,
    description: String,
) -> Result<(), String> {
    // https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#update-a-repository

    let octocrab = state.octocrab.clone();

    let body = serde_json::json!({"description": description});
    let response = octocrab
        .patch::<octocrab::models::Repository, _, serde_json::value::Value>(
            format!("/repos/{}/{}", owner_name, repository_name),
            Some(&body),
        )
        .await
        .map_err(|err| err.to_string())?;

    let db = &state.db;
    crate::database::update::update_repository_table_entry(db, &octocrab, response).await
}
