/// Read content from a secret file.
///
/// This function could very well be a macro, but it is a function for the sake of clarity.
/// Note that the function returns the content of the file as is and does not deserialize it.
///
/// # Error
///
/// - Tauri cannot resolve the path to the secret directory,
/// - file does not exist at the resolved path,
/// - system cannot read file content.
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
                Err("Cannot read content")
            }
        },
        Ok(false) => {
            log::error!("File does not exist at \"{}\"", &file_path.display());
            Err("File does not exist")
        }
        Err(err) => {
            log::error!(
                "Cannot check if file exists at \"{}\": \"{}\"",
                &file_path.display(),
                err,
            );
            Err("Cannot check if file exists")
        }
    }
}

/// Reads the app ID.
///
/// This function is a wrapper around [`get_secret_file`] that reads the app ID file.
pub fn get_app_id(handle: tauri::AppHandle) -> Result<String, &'static str> {
    get_secret_file(handle, crate::app::constants::APP_ID_FILE_NAME)
}

/// Reads and deserializes the installation ID.
///
/// This function is a wrapper around [`get_secret_file`] that reads the installation ID file.
pub fn get_installation_id(handle: tauri::AppHandle) -> Result<String, &'static str> {
    get_secret_file(handle, crate::app::constants::INSTALLATION_ID_FILE_NAME)
}

/// Reads and deserializes the RSA public key.
///
/// This function is a wrapper around [`get_secret_file`] that reads the RSA public key file.
pub fn get_rsa_private_key(handle: tauri::AppHandle) -> Result<String, &'static str> {
    get_secret_file(handle, crate::app::constants::RSA_PRIVATE_KEY_FILE_NAME)
}
