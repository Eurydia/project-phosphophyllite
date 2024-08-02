macro_rules! create_dir_if_needed {
    ($dir_path:expr) => {{
        match std::fs::create_dir_all($dir_path) {
            Ok(_) => (),
            Err(err) => {
                log::error!(
                    "System cannot create dir at \"{}\": \"{}\"",
                    $dir_path.display(),
                    err
                );
                return Err("Cannot create dir");
            }
        }
    }};
}

/// Create file if it does not exist
macro_rules! create_file_if_needed {
    ($file_path:expr) => {{
        match $file_path.try_exists() {
            Ok(true) => Ok(true),
            Ok(false) => match std::fs::File::create($file_path) {
                Ok(_) => Ok(false),
                Err(err) => {
                    log::error!("System cannot create file: \"{}\"", err);
                    Err("Cannot create file")
                }
            },
            Err(err) => {
                log::error!("System cannot check if file exists: \"{}\"", err);
                Err("Cannot check if file exists")
            }
        }
    }};
}

/// Create directory and file for database.
///
/// Separately creates:
/// - the directory for the database
/// - the `.sqlite` database file
fn create_database_file(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let dir_path = crate::paths::get_database_dir(handle.clone())?;
    create_dir_if_needed!(&dir_path);

    let file_path = dir_path.join(crate::app::constants::DB_FILE_NAME);
    let _ = create_file_if_needed!(file_path)?;

    Ok(())
}

/// Create secret directory and secret files if they do not exist.
///
/// Separately creates:
/// - the directory
/// - the file which will store the app id
/// - the file which will store the installation id
/// - the file which will store the RSA private key
fn create_secret_files(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let dir_path = crate::paths::get_secret_dir(handle.clone())?;
    create_dir_if_needed!(&dir_path);

    let app_id_file_path = dir_path.join(crate::app::constants::APP_ID_FILE_NAME);
    let _ = create_file_if_needed!(app_id_file_path)?;

    let installation_id_file_path = dir_path.join(crate::app::constants::INSTALLATION_ID_FILE_NAME);
    let _ = create_file_if_needed!(installation_id_file_path)?;

    let rsa_private_key_file_path = dir_path.join(crate::app::constants::RSA_PRIVATE_KEY_FILE_NAME);
    let _ = create_file_if_needed!(rsa_private_key_file_path)?;

    Ok(())
}

/// Create setting directory and setting file if they do not exist.
///
/// Separately creates:
/// - the directory for settings
/// - the file which will store the settings
fn create_setting_files(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let dir_path = crate::paths::get_setting_dir(handle.clone())?;
    create_dir_if_needed!(&dir_path);

    let file_path = dir_path.join(crate::app::constants::SETTINGS_FILE_NAME);
    match create_file_if_needed!(file_path) {
        Ok(true) => Ok(()),
        Ok(false) => crate::settings::revert_app_settings(handle),
        Err(err) => Err(err),
    }
}

/// Prepare all paths and files needed by the application.
///
/// Separately creates:
/// - directories for migrations, logs, and temporary files
/// - the database file
/// - the secret files
/// - the setting files
pub fn prepare_paths(handle: tauri::AppHandle) -> Result<(), &'static str> {
    create_dir_if_needed!(crate::paths::get_migration_dir(handle.clone())?);
    create_dir_if_needed!(crate::paths::get_log_dir(handle.clone())?);
    create_dir_if_needed!(crate::paths::get_temp_dir(handle.clone())?);

    create_database_file(handle.clone())?;
    create_secret_files(handle.clone())?;
    create_setting_files(handle.clone())?;

    Ok(())
}
