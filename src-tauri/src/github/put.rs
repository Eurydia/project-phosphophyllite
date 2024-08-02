/// Updates or create the README of a repository.
///
/// This funciton takes an unencoded content string and updates the README of a repository with it.
/// The current implementation makes three separate requests to GitHub's API.
///
/// - The first request is to get the metadata of the README file. This is needed for the SHA and path of the README. This is needed because the name of the README file is not always `README.md`.
///
/// - The second request is to update the README file with the new content. This request requires the SHA of the README file, which is why the first request is needed.
///
/// - The third request is to get the updated repository. This request might not be needed, since the update function does not actually need the updated repository.
///
///
/// [API documentation](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents)
///
/// # Error
/// - [`octocrab`] cannot request repository
/// - [`octocrab`] cannot get README metadata
/// - [`octocrab`] cannot update README
/// - [`crate::database::update::update_repository_table_entry`] cannot update repository table entry
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
    let crab = state.octocrab.repos(owner_name, repository_name);

    let octocrab::models::repos::Content { sha, path, .. } = match crab.get_readme().send().await {
        Ok(readme) => readme,
        Err(err) => {
            log::error!("Octocrab cannot get README metadata: \"{}\"", err);
            return Err("Cannot get README metadata");
        }
    };

    match crab
        .update_file(path, commit_message, unencoded_content, sha)
        .send()
        .await
    {
        Ok(_) => (),
        Err(err) => {
            log::error!("Octocrab cannot update README: \"{}\"", err);
            return Err("Cannot update README");
        }
    };

    let repository = match crab.get().await {
        Ok(repo) => repo,
        Err(err) => {
            log::error!("Octocrab cannot get repository: \"{}\"", err);
            return Err("Cannot get repository");
        }
    };

    crate::database::update::update_repository_table_entry(&state.db, &state.octocrab, &repository)
        .await
}
