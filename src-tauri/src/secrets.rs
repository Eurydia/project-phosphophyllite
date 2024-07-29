fn get_secret_file(handle: tauri::AppHandle, file_path: &str) -> Result<String, &'static str> {
    let path = crate::paths::get_secret_path(handle)?;
    let file_path = path.join(file_path);

    match file_path.try_exists() {
        Ok(true) => match std::fs::read_to_string(&file_path) {
            Ok(content) => Ok(content),
            Err(err) => {
                log::error!("Failed to read secret file: {}", err);
                Err("Failed to read secret file")
            }
        },
        Err(_) | Ok(false) => {
            log::trace!("Trying to create secret file since it does not exist");
            match std::fs::File::create(&file_path) {
                Ok(_) => Ok(String::default()),
                Err(err) => {
                    log::error!("Failed to create secret file: {}", err);
                    Err("Failed to create secret file")
                }
            }
        }
    }
}

pub fn get_app_id(handle: tauri::AppHandle) -> Result<String, &'static str> {
    get_secret_file(handle, "APP_ID.txt")
}

pub fn get_installation_id(handle: tauri::AppHandle) -> Result<String, &'static str> {
    get_secret_file(handle, "INSTALLATION_ID.txt")
}

pub fn get_rsa_private_key(handle: tauri::AppHandle) -> Result<String, &'static str> {
    get_secret_file(handle, "RSA_PRIVATE_KEY.pem")
}
