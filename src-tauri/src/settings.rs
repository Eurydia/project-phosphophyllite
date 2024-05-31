use std::io::Write;

#[tauri::command]
pub fn get_repo_query_preferences(handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/settings/repo_query_preferences.json")
        .unwrap();
    let data = std::fs::read_to_string(resource_path).unwrap();
    return data;
}

#[tauri::command]
pub fn set_repo_query_preferences(handle: tauri::AppHandle, json_string: String) {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/settings/repo_query_preferences.json")
        .unwrap();

    let mut file = std::fs::OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(&resource_path)
        .unwrap();
    file.write_all(&json_string.as_bytes()).unwrap();
}

#[tauri::command]
pub fn get_issue_query_preferences(handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/settings/issue_query_preferences.json")
        .unwrap();
    let data = std::fs::read_to_string(&resource_path).unwrap();
    return data;
}

#[tauri::command]
pub fn set_issue_query_preferences(handle: tauri::AppHandle, json_string: String) {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/settings/issue_query_preferences.json")
        .unwrap();
    let mut file = std::fs::OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(&resource_path)
        .unwrap();
    file.write_all(&json_string.as_bytes()).unwrap();
}
