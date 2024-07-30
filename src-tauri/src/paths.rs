use std::io::Write;

macro_rules! resolve_path {
    ($path:expr) => {{
        log::trace!("Resolving path");
        match $path {
            Some(path) => path,
            None => {
                log::error!("Failed to resolve path");
                return Err("Something went wrong while trying to resolve path");
            }
        }
    }};
}

pub fn get_log_path(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    log::trace!("Getting log path");
    let path = resolve_path!(handle.path_resolver().app_log_dir());
    Ok(path.join("log"))
}

pub fn get_db_path(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    log::trace!("Getting db path");
    let path = resolve_path!(handle.path_resolver().app_local_data_dir());
    Ok(path.join("database"))
}

pub fn get_temp_path(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    log::trace!("Getting temp path");
    let path = resolve_path!(handle.path_resolver().app_local_data_dir());
    Ok(path.join("temp"))
}

pub fn get_secret_path(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    log::trace!("Getting secret path");
    let path = resolve_path!(handle.path_resolver().app_local_data_dir());
    Ok(path.join("secrets"))
}

pub fn get_setting_path(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    trace!("Getting setting path");
    let path = resolve_path!(handle.path_resolver().app_config_dir());
    Ok(path.join("settings"))
}
