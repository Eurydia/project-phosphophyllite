use std::io::Write;

#[tauri::command]
pub fn get_pref_repo(handle: tauri::AppHandle) -> String {
    let resource_path_option = handle
        .path_resolver()
        .resolve_resource("./resources/pref/repo.json");
    let resource_path = match resource_path_option {
        None => return String::default(),
        Some(p) => p,
    };
    let data_result = std::fs::read_to_string(resource_path);
    let _ = match data_result {
        Err(_) => return String::default(),
        Ok(dt) => return dt,
    };
}

#[tauri::command]
pub fn set_pref_repo(handle: tauri::AppHandle, json_string: String) {
    let path = handle
        .path_resolver()
        .resolve_resource("./resources/pref")
        .unwrap();

    if !std::path::Path::exists(&path) {
        std::fs::create_dir_all(&path).unwrap();
    }
    let file_result = std::fs::OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(path.join("repo.json"));
    let mut file = match file_result {
        Err(_) => return,
        Ok(f) => f,
    };
    file.write_all(&json_string.as_bytes()).unwrap();
}

#[tauri::command]
pub fn get_pref_issue(handle: tauri::AppHandle) -> String {
    let resource_path_option = handle
        .path_resolver()
        .resolve_resource("./resources/pref/issue.json");
    let resource_path = match resource_path_option {
        None => return String::default(),
        Some(p) => p,
    };
    let data_result = std::fs::read_to_string(resource_path);
    let _ = match data_result {
        Err(_) => return String::default(),
        Ok(dt) => return dt,
    };
}

#[tauri::command]
pub fn set_pref_issue(handle: tauri::AppHandle, json_string: String) {
    let path = handle
        .path_resolver()
        .resolve_resource("./resources/pref")
        .unwrap();

    if !std::path::Path::exists(&path) {
        std::fs::create_dir_all(&path).unwrap();
    }
    let file_result = std::fs::OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(path.join("issue.json"));
    let mut file = match file_result {
        Err(_) => return,
        Ok(f) => f,
    };
    file.write_all(&json_string.as_bytes()).unwrap();
}
