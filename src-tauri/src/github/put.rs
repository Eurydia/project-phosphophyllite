#[tauri::command]
pub async fn put_repository_readme(
    _: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
    owner_name: String,
    repository_name: String,
    content: String,
) -> Result<bool, String> {
    // https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#create-or-update-file-contents
    let octocrab = state.octocrab.repos(owner_name, repository_name);
    let sha = octocrab.get_readme().send().await.unwrap().sha;
    octocrab
        .update_file(
            "readme.md",
            "updated readme via Phosphophyllite",
            content,
            sha,
        )
        .send()
        .await
        .unwrap();

    let repository = octocrab.get().await.unwrap();

    crate::database::update::update_repository_table_entry(&state.db, &state.octocrab, repository)
        .await;

    Ok(false)
}
