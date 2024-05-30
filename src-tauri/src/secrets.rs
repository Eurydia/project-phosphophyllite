#[tauri::command]
pub fn get_app_id(handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/secrets/APP_ID.txt")
        .unwrap();
    let app_id = std::fs::read_to_string(&resource_path).unwrap();
    return app_id;
}

#[tauri::command]
pub fn get_installation_id(handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/secrets/INSTALLATION_ID.txt")
        .unwrap();
    let installation_id = std::fs::read_to_string(&resource_path).unwrap();
    return installation_id;
}

#[tauri::command]
pub fn get_private_key(handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/secrets/PRIVATE_KEY.txt")
        .unwrap();
    let private_key = std::fs::read_to_string(&resource_path).unwrap();
    return private_key;
}
