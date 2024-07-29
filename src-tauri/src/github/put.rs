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
) -> Result<(), &'static str> {
    log::trace!(
        "Preparing octocrab instance for repository: {}/{}",
        &owner_name,
        &repository_name
    );
    let crab = state.octocrab.repos(owner_name, repository_name);

    log::trace!("Getting repository");
    let repository = match crab.get().await {
        Ok(repo) => repo,
        Err(err) => {
            log::error!("Error found while trying to get repository: {}", err);
            return Err("Something went wrong while getting repository data");
        }
    };
    log::trace!("Collecting SHA and path of README");
    let octocrab::models::repos::Content { sha, path, .. } = match crab.get_readme().send().await {
        Ok(readme) => readme,
        Err(err) => {
            log::error!(
                "Error found while trying to collect README metadata: {}",
                err
            );
            return Err("Something went wrong collecting README metadata");
        }
    };

    log::trace!("Sending update request");
    match crab
        .update_file(path, commit_message, unencoded_content, sha)
        .send()
        .await
    {
        Ok(_) => (),
        Err(err) => {
            log::error!("Error found while trying to update README: {}", err);
            return Err("Something went wrong while updating README");
        }
    };

    crate::database::update::update_repository_table_entry(
        &state.db,
        state.octocrab.clone(),
        repository,
    )
    .await
}
