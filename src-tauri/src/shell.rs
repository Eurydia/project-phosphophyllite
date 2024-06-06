#[tauri::command]
pub fn open_url(url: String) {
    let _ = open::that(url);
}

#[tauri::command]
pub fn open_secret_dir(handle: tauri::AppHandle) {
    let path = handle
        .path_resolver()
        .resolve_resource("./resources/secrets")
        .unwrap();
    let _ = open::that(path);
}
