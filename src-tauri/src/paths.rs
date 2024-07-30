pub fn get_log_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    log::trace!("Getting log dir");
    match handle.path_resolver().app_log_dir() {
        Some(path) => Ok(path),
        None => {
            log::error!("Cannot get log dir");
            Err("Cannot get log dir")
        }
    }
}

pub fn get_database_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    log::trace!("Getting database dir");
    match handle.path_resolver().app_local_data_dir() {
        Some(path) => Ok(path.join("database")),
        None => {
            log::error!("Cannot get database dir");
            Err("Cannot get database dir")
        }
    }
}

pub fn get_temp_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    log::trace!("Getting temp dir");
    match handle.path_resolver().app_local_data_dir() {
        Some(path) => Ok(path.join("temp")),
        None => {
            log::error!("Cannot get temp dir");
            Err("Cannot get temp dir")
        }
    }
}

pub fn get_secret_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    log::trace!("Getting secret dir");
    match handle.path_resolver().app_local_data_dir() {
        Some(path) => Ok(path.join("secret")),
        None => {
            log::error!("Cannot get secret dir");
            Err("Cannot get secret dir")
        }
    }
}

pub fn get_setting_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    log::trace!("Getting setting dir");
    match handle.path_resolver().app_config_dir() {
        Some(path) => Ok(path.join("settings")),
        None => {
            log::error!("Cannot get setting dir");
            Err("Cannot get setting dir")
        }
    }
}

pub fn get_migration_dir(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    log::trace!("Getting migration dir");
    match handle.path_resolver().resource_dir() {
        Some(path) => Ok(path.join("resources").join("migrations")),
        None => {
            log::error!("Cannot get migration dir");
            Err("Cannot get migration dir")
        }
    }
}
