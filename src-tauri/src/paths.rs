/// Unwraps [`Option<PathBuf>`] into [`Result<PathBuf, &'static str>`].
///
/// # Error
///
/// - Tauri cannot resolve the base directory
macro_rules! resolve_dir {
    ($path:expr) => {{
        match $path {
            Some(path) => Ok(path),
            None => {
                log::error!("Tauri cannot resolve dir \"{}\"", stringify!($path));
                Err("Cannot resolve dir")
            }
        }
    }};
}

/// Returns the path to the log directory.
///
/// This function is a wrapper around [`resolve_dir!`] that resolves the path to the log directory.
/// The target path is `{app_log_dir}/`.
pub fn get_log_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    resolve_dir!(handle.path_resolver().app_log_dir())
}

/// Returns the path to the database directory.
///
/// This function is a wrapper around [`resolve_dir!`] that resolves the path to the database directory.
/// The target path is `{app_local_data_dir}/database/`.
pub fn get_database_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    let path = resolve_dir!(handle.path_resolver().app_local_data_dir())?;
    Ok(path.join("database"))
}

/// Returns the path to the temporary directory.
///
/// This function is a wrapper around [`resolve_dir!`] that resolves the path to the temporary directory.
/// The target path is `{app_local_data_dir}/temp/`.
pub fn get_temp_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    let path = resolve_dir!(handle.path_resolver().app_local_data_dir())?;
    Ok(path.join("temp"))
}

/// Returns the path to the secret directory.
///
/// This function is a wrapper around [`resolve_dir!`] that resolves the path to the secret directory.
/// The target path is `{app_local_data_dir}/secrets/`.
pub fn get_secret_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    let path = resolve_dir!(handle.path_resolver().app_local_data_dir())?;
    Ok(path.join("secrets"))
}

/// Returns the path to the settings directory.
///
/// This function is a wrapper around [`resolve_dir!`] that resolves the path to the settings directory.
/// The target path is `{app_local_data_dir}/settings/`.
pub fn get_setting_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    let path = resolve_dir!(handle.path_resolver().app_local_data_dir())?;
    Ok(path.join("settings"))
}

/// Returns the path to the migrations directory.
///
/// This function is a wrapper around [`resolve_dir!`] that resolves the path to the migrations directory.
/// The target path is `{resource_dir}/migrations/`.
pub fn get_migration_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    let path = resolve_dir!(handle.path_resolver().resource_dir())?;
    Ok(path.join("resources").join("migrations"))
}
