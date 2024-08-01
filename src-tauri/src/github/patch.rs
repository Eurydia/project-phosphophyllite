/// Updates the description of a repository.
///
/// [API documentation](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#update-a-repository)
///
/// # Error
/// - [`octocrab`] cannot update description
/// - [`crate::database::update::update_repository_table_entry`] cannot update repository table entry
#[tauri::command]
pub async fn patch_repository_description(
    _: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
    owner_name: String,
    repository_name: String,
    description: String,
) -> Result<(), &'static str> {
    let request_body = serde_json::json!({"description": description});

    let updated_repository = match state
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

    crate::database::update::update_repository_table_entry(
        &state.db,
        state.octocrab.clone(),
        updated_repository,
    )
    .await
}
