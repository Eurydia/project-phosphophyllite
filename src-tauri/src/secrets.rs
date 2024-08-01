/// Read content of a secret file
/// Errors if the file does not exist or cannot be read
fn get_secret_file(handle: tauri::AppHandle, file_path: &str) -> Result<String, &'static str> {
    let dir_path = crate::paths::get_secret_dir(handle)?;
    let file_path = dir_path.join(file_path);

    match &file_path.try_exists() {
        Ok(true) => match std::fs::read_to_string(&file_path) {
            Ok(content) => Ok(content),
            Err(err) => {
                log::error!(
                    "Cannot read content from \"{}\": \"{}\"",
                    &file_path.display(),
                    err
                );
                Err("Cannot read content from setting file")
            }
        },
        Ok(false) => {
            log::error!("File does not exist at \"{}\"", &file_path.display());
            Err("Settings file does not exist")
        }
        Err(err) => {
            log::error!(
                "Cannot check if file exists at \"{}\": \"{}\"",
                &file_path.display(),
                err,
            );
            Err("Cannot check if settings file exists")
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
