use crate::{pref::resolve_preference_dir, secrets::resolve_secret_path};

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
pub fn open_preference_dir(handle: tauri::AppHandle) {
    let path = resolve_preference_dir(handle);
    open::that(path).unwrap();
}
