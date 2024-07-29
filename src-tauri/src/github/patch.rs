/// Updates the description of a repository.
///
/// The api returns the updated repository as respond, which means I can simply give the respond to the database and update the entry.
///
/// [API documentation](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#update-a-repository)
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
    log::trace!(
        "Patching repository description: {}/{}",
        &owner_name,
        &repository_name
    );
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
            log::error!("Error found while trying to update repository: {}", err);
            return Err("Something went wrong while patching repository");
        }
    };

    crate::database::update::update_repository_table_entry(
        &state.db,
        state.octocrab.clone(),
        updated_repository,
    )
    .await
}
