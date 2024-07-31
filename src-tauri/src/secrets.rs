/// Read content of a secret file
/// Errors if the file does not exist or cannot be read
fn get_secret_file(handle: tauri::AppHandle, file_path: &str) -> Result<String, &'static str> {
    let dir_path = crate::paths::get_secret_dir(handle)?;
    let file_path = dir_path.join(file_path);

    log::trace!("Checking if file exists: {}", file_path.display());
    match file_path.try_exists() {
        Ok(true) => {
            log::trace!("Reading content");
            match std::fs::read_to_string(&file_path) {
                Ok(content) => {
                    log::trace!("Ok");
                    Ok(content)
                }
                Err(err) => {
                    log::error!("Cannot read content: {}", err);
                    Err("Cannot read content")
                }
            }
        }
        Ok(false) => {
            log::error!("File does not exist");
            Err("File does not exist")
        }
        Err(err) => {
            log::error!("Cannot check if file exists: {}", err);
            Err("Cannot check if file exists")
        }
    }
}

pub fn get_app_id(handle: tauri::AppHandle) -> Result<String, &'static str> {
    get_secret_file(handle, crate::app::constants::APP_ID_FILE_NAME)
}

pub fn get_installation_id(handle: tauri::AppHandle) -> Result<String, &'static str> {
    get_secret_file(handle, crate::app::constants::INSTALLATION_ID_FILE_NAME)
}

pub fn get_rsa_private_key(handle: tauri::AppHandle) -> Result<String, &'static str> {
    get_secret_file(handle, crate::app::constants::RSA_PRIVATE_KEY_FILE_NAME)
}
