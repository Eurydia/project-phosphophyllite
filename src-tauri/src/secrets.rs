fn get_secret_file(handle: &tauri::AppHandle, file_path: &str) -> Result<String, String> {
    let path = crate::paths::get_secret_path(handle)?;
    let file_path = path.join(file_path);

    match file_path.try_exists() {
        Ok(true) => std::fs::read_to_string(&file_path).map_err(|err| {
            log::error!("Failed to read secret file: {}", err);
            err.to_string()
        }),
        Err(_) | Ok(false) => {
            std::fs::File::create(&file_path).map_err(|err| {
                log::error!("Failed to create secret file: {}", err);
                err.to_string()
            })?;
            Ok(String::default())
        }
    }
}

pub fn get_app_id(handle: &tauri::AppHandle) -> Result<String, String> {
    get_secret_file(handle, "APP_ID.txt")
}

pub fn get_installation_id(handle: &tauri::AppHandle) -> Result<String, String> {
    get_secret_file(handle, "INSTALLATION_ID.txt")
}

pub fn get_rsa_private_key(handle: &tauri::AppHandle) -> Result<String, String> {
    get_secret_file(handle, "RSA_PRIVATE_KEY.pem")
}
