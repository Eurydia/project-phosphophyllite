macro_rules! resolve_dir {
    ($path:expr) => {{
        log::trace!("Resolving dir: \"{}\"", stringify!($path));
        match $path {
            Some(path) => {
                log::trace!("Ok");
                Ok(path)
            }
            None => {
                log::error!("Cannot resolve dir");
                Err("Cannot resolve dir")
            }
        }
    }};
}

pub fn get_log_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    resolve_dir!(handle.path_resolver().app_log_dir())
}

pub fn get_database_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    let path = resolve_dir!(handle.path_resolver().app_local_data_dir())?;
    Ok(path.join("database"))
}

pub fn get_temp_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    let path = resolve_dir!(handle.path_resolver().app_local_data_dir())?;
    Ok(path.join("temp"))
}

pub fn get_secret_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    let path = resolve_dir!(handle.path_resolver().app_local_data_dir())?;
    Ok(path.join("secrets"))
}

pub fn get_setting_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    let path = resolve_dir!(handle.path_resolver().app_local_data_dir())?;
    Ok(path.join("settings"))
}

pub fn get_migration_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    let path = resolve_dir!(handle.path_resolver().resource_dir())?;
    Ok(path.join("resources").join("migrations"))
}
