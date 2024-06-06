#[tauri::command]
pub fn open_url(url: String) {
    let _ = open::that(url);
}
