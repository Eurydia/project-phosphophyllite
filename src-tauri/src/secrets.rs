use std::path::PathBuf;

pub fn resolve_secret_path(handle: tauri::AppHandle) -> PathBuf {
    let path = handle.path_resolver().app_local_data_dir().unwrap();
    return path.join("secrets");
}

fn resolve_secret_file(handle: tauri::AppHandle, file_name: &str) -> String {
    let path = resolve_secret_path(handle);
    let file_path = path.join(file_name);
    return std::fs::read_to_string(&file_path).unwrap_or_else(|_| {
        if !file_path.exists() {
            std::fs::create_dir_all(path).unwrap();
            std::fs::File::create(file_path).unwrap();
        }
        return String::default();
    });
}

#[tauri::command]
pub fn get_secret_app_id(handle: tauri::AppHandle) -> String {
    return resolve_secret_file(handle, "APP_ID.txt");
}

#[tauri::command]
pub fn get_secret_installation_id(handle: tauri::AppHandle) -> String {
    return resolve_secret_file(handle, "INSTALLATION_ID.txt");
}

#[tauri::command]
pub fn get_secret_private_key(handle: tauri::AppHandle) -> String {
    return resolve_secret_file(handle, "PRIVATE_KEY.txt");
}
