use crate::{secrets::resolve_secret_path, settings::resolve_preference_file_path};

#[tauri::command]
pub fn open_url(url: String) {
    open::that(url).unwrap();
}

#[tauri::command]
pub fn open_secret_dir(handle: tauri::AppHandle) {
    let path = resolve_secret_path(handle);
    open::that(path).unwrap();
}

#[tauri::command]
pub fn open_preference_file(handle: tauri::AppHandle) {
    let path = resolve_preference_file_path(handle);
    open::that(path).unwrap();
}
