use std::io::Write;

#[tauri::command]
pub fn get_pref_repo(handle: tauri::AppHandle) -> String {
    let path = handle
        .path_resolver()
        .app_config_dir()
        .unwrap()
        .join("preferences")
        .join("query_preferences_repository.json");
    return std::fs::read_to_string(path).unwrap_or(String::default());
}

#[tauri::command]
pub fn set_pref_repo(handle: tauri::AppHandle, json_string: String) {
    let path = handle
        .path_resolver()
        .app_config_dir()
        .unwrap()
        .join("preferences");
    if !std::path::Path::exists(&path) {
        std::fs::create_dir_all(&path).unwrap();
    }

    std::fs::OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(path.join("query_preferences_repository.json"))
        .unwrap()
        .write_all(&json_string.as_bytes())
        .unwrap();
}

#[tauri::command]
pub fn get_pref_issue(handle: tauri::AppHandle) -> String {
    let path = handle
        .path_resolver()
        .app_config_dir()
        .unwrap()
        .join("preferences")
        .join("query_preferences_issues.json");

    return std::fs::read_to_string(path).unwrap_or(String::default());
}

#[tauri::command]
pub fn set_pref_issue(handle: tauri::AppHandle, json_string: String) {
    let path = handle
        .path_resolver()
        .app_config_dir()
        .unwrap()
        .join("preferences");

    if !std::path::Path::exists(&path) {
        std::fs::create_dir_all(&path).unwrap();
    }
    std::fs::OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(path.join("query_preferences_issues.json"))
        .unwrap()
        .write_all(&json_string.as_bytes())
        .unwrap();
}
