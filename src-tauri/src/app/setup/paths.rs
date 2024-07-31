macro_rules! create_dir_if_needed {
    ($dir_path:expr) => {{
        log::trace!("Creating dir: {}", $dir_path.display());
        match std::fs::create_dir_all($dir_path) {
            Ok(_) => {
                log::trace!("Ok");
            }
            Err(err) => {
                log::error!("Cannot create dir: {}", err);
                return Err("Cannot create dir");
            }
        }
    }};
}

/// Create file if it does not exist
///
/// Returns `Result<bool>` if file already exists
macro_rules! create_file_if_needed {
    ($file_path:expr) => {{
        log::trace!("Checking if file exists: {}", $file_path.display());
        match $file_path.try_exists() {
            Ok(true) => {
                log::trace!("Ok");
                Ok(true)
            }
            Ok(false) => {
                log::trace!("Creating file");
                match std::fs::File::create($file_path) {
                    Ok(_) => Ok(false),
                    Err(err) => {
                        log::error!("Cannot create file: {}", err);
                        Err("Cannot create file")
                    }
                }
            }
            Err(err) => {
                log::error!("Cannot check if file exists: {}", err);
                Err("Cannot check if file exists")
            }
        }
    }};
}

fn create_database_file(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let dir_path = crate::paths::get_database_dir(handle.clone())?;
    create_dir_if_needed!(&dir_path);

    let file_path = dir_path.join(crate::app::constants::DB_FILE_NAME);
    let _ = create_file_if_needed!(file_path);

    Ok(())
}

fn create_secret_files(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let dir_path = crate::paths::get_secret_dir(handle.clone())?;
    create_dir_if_needed!(&dir_path);

    let app_id_file_path = dir_path.join(crate::app::constants::APP_ID_FILE_NAME);
    create_file_if_needed!(app_id_file_path);

    let installation_id_file_path = dir_path.join(crate::app::constants::INSTALLATION_ID_FILE_NAME);
    create_file_if_needed!(installation_id_file_path);

    let rsa_private_key_file_path = dir_path.join(crate::app::constants::RSA_PRIVATE_KEY_FILE_NAME);
    create_file_if_needed!(rsa_private_key_file_path);

    Ok(())
}

fn create_setting_files(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let dir_path = crate::paths::get_setting_dir(handle.clone())?;
    create_dir_if_needed!(&dir_path);

    let file_path = dir_path.join(crate::app::constants::SETTINGS_FILE_NAME);
    match create_file_if_needed!(file_path) {
        Ok(true) => (),
        Ok(false) => {
            log::trace!("Populating initial settings");
            crate::settings::revert_app_settings(handle)?;
        }
        Err(err) => return Err(err),
    };

    Ok(())
}

pub fn prepare_paths(handle: tauri::AppHandle) -> Result<(), &'static str> {
    log::trace!("Preparing paths");

    create_dir_if_needed!(crate::paths::get_migration_dir(handle.clone())?);
    create_dir_if_needed!(crate::paths::get_log_dir(handle.clone())?);
    create_dir_if_needed!(crate::paths::get_temp_dir(handle.clone())?);

    create_database_file(handle.clone())?;
    create_secret_files(handle.clone())?;
    create_setting_files(handle.clone())?;

    Ok(())
}
