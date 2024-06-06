#[tauri::command]
pub fn get_app_id(handle: tauri::AppHandle) -> String {
    let path_option = handle
        .path_resolver()
        .resolve_resource("./resources/secrets/APP_ID.txt");
    let path = match path_option {
        Some(p) => p,
        None => return String::default(),
    };
    let data_result = std::fs::read_to_string(&path);
    let data = match data_result {
        Ok(dt) => dt,
        Err(_) => return String::default(),
    };
    return data;
}

#[tauri::command]
pub fn get_installation_id(handle: tauri::AppHandle) -> String {
    let path_option = handle
        .path_resolver()
        .resolve_resource("./resources/secrets/INSTALLATION_ID.txt");
    let path = match path_option {
        Some(p) => p,
        None => return String::default(),
    };
    let data_result = std::fs::read_to_string(&path);
    let data = match data_result {
        Ok(dt) => dt,
        Err(_) => return String::default(),
    };
    return data;
}

#[tauri::command]
pub fn get_private_key(handle: tauri::AppHandle) -> String {
    let path_option = handle
        .path_resolver()
        .resolve_resource("./resources/secrets/PRIVATE_KEY.txt");
    let path = match path_option {
        Some(p) => p,
        None => return String::default(),
    };
    let data_result = std::fs::read_to_string(&path);
    let data = match data_result {
        Ok(dt) => dt,
        Err(_) => return String::default(),
    };
    return data;
}
