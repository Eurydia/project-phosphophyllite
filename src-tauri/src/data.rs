use std::io::Write;

fn resolve_data_storage_path(handle: &tauri::AppHandle) -> std::path::PathBuf {
    let path = handle
        .path_resolver()
        .app_local_data_dir()
        .unwrap()
        .join("storage");
    if !std::path::Path::exists(&path) {
        std::fs::create_dir_all(&path).unwrap();
    }
    return path;
}

#[tauri::command]
pub fn get_data_misc(handle: tauri::AppHandle) -> String {
    let path = resolve_data_storage_path(&handle).join("misc.json");
    return std::fs::read_to_string(path).unwrap_or_else(|_| String::default());
}

#[tauri::command]
pub fn set_data_misc(handle: tauri::AppHandle, json_string: String) {
    let path = resolve_data_storage_path(&handle);
    std::fs::File::create(path.join("misc.json"))
        .unwrap()
        .write_all(&json_string.as_bytes())
        .unwrap();
}
