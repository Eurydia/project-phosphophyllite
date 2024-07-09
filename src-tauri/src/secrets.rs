fn get_secret(handle: &tauri::AppHandle, file_path: &str) -> String {
    let path = crate::paths::get_secret_path(handle);
    let file = path.join(file_path);
    match file.try_exists() {
        Ok(true) => (),
        Err(_) | Ok(false) => {
            std::fs::File::create(&file).unwrap();
        }
    }
    std::fs::read_to_string(file).unwrap_or(String::default())
}

pub fn get_app_id(handle: &tauri::AppHandle) -> String {
    get_secret(handle, "APP_ID.txt")
}

pub fn get_installation_id(handle: &tauri::AppHandle) -> String {
    get_secret(handle, "INSTALLATION_ID.txt")
}

pub fn get_rsa_private_key(handle: &tauri::AppHandle) -> String {
    get_secret(handle, "RSA_PRIVATE_KEY.pem")
}
