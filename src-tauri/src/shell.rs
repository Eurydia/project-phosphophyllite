#[tauri::command]
pub fn open_url(url: String) {
    open::that(url).unwrap();
}
