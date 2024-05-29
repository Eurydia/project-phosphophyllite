use std::fs;

#[tauri::command]
pub fn get_app_id(handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/secrets/APP_ID.txt")
        .expect("failed to resolve resource");
    let app_id = fs::read_to_string(&resource_path).expect("Cannot open file. Obtain private key from app installation https://github.com/settings/apps/<app-name>.").into();
    return app_id;
}

#[tauri::command]
pub fn get_installation_id(handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/secrets/INSTALLATION_ID.txt")
        .expect("failed to resolve resource");
    let installation_id = fs::read_to_string(&resource_path).expect("Cannot open file. Obtain installation id from app installation https://github.com/settings/installations/<installation-id>.").into();
    return installation_id;
}

#[tauri::command]
pub fn get_private_key(handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/secrets/PRIVATE_KEY.txt")
        .expect("failed to resolve resource");

    let private_key = fs::read_to_string(&resource_path).expect("Cannot open file. Obtain private key from app installation https://github.com/settings/apps/<app-name>.").into();

    return private_key;
}
