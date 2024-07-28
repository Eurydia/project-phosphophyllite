use std::io::Write;

/// Get `PathBuf` to the log directory
///
/// ## Notes
/// Called by the opener to reveal the directory. Tries to create the directory if it doesn't exist.
///
/// I use `Result` here since a missing log directory is a recoverable error.
/// Even though the log directory should be prepared by the logger, so it should always exist in practice.
pub fn get_log_path(handle: &tauri::AppHandle) -> Result<std::path::PathBuf, &str> {
    let path = match handle.path_resolver().app_log_dir() {
        Some(path) => path,
        None => {
            log::warn!("Tauri failed to resolve log directory");
            return Err("Failed to resolve log directory");
        }
    };

    match path.try_exists() {
        Ok(true) => Ok(path),
        Err(_) | Ok(false) => {
            log::info!("Log directory does not exist");
            log::info!("Trying to recover by creating the directory");
            match std::fs::create_dir_all(&path) {
                Ok(()) => {
                    log::info!("Log directory created");
                    Ok(path)
                }
                Err(err) => {
                    log::warn!("Failed to create log directory: {}", err);
                    Err("Failed to create directory for logs")
                }
            }
        }
    }
}

/// Get `PathBuf` to the temp directory
pub fn get_temp_path(handle: &tauri::AppHandle) -> Result<std::path::PathBuf, &str> {
    let path = match handle.path_resolver().app_local_data_dir() {
        Some(path) => path.join("temp"),
        None => {
            log::warn!("Tauri failed to resolve app local data directory");
            return Err("Failed to resolve app local data directory");
        }
    };

    match path.try_exists() {
        Ok(true) => Ok(path),
        Err(_) | Ok(false) => match std::fs::create_dir_all(&path) {
            Ok(()) => Ok(path),
            Err(err) => {
                log::warn!("Failed to create temp directory: {}", err);
                Err("Failed to create directory for temp files")
            }
        },
    }
}

/// Get `PathBuf` to the secret directory
pub fn get_secret_path(handle: &tauri::AppHandle) -> Result<std::path::PathBuf, &str> {
    let path = match handle.path_resolver().app_local_data_dir() {
        Some(path) => path.join("secrets"),
        None => {
            log::warn!("Tauri failed to resolve app local data directory");
            return Err("Failed to resolve app local data directory");
        }
    };

    match path.try_exists() {
        Ok(true) => Ok(path),
        Err(_) | Ok(false) => match std::fs::create_dir_all(&path) {
            Ok(()) => Ok(path),
            Err(err) => {
                log::warn!("Failed to create secret directory: {}", err);
                Err("Failed to create directory for secrets")
            }
        },
    }
}

pub fn get_setting_file(handle: &tauri::AppHandle) -> Result<std::path::PathBuf, &str> {
    let path = match handle.path_resolver().app_config_dir() {
        Some(path) => {
            let mut path_ = path.join("settings");
            path_.set_extension("json");
            path_
        }
        None => {
            log::warn!("Tauri failed to resolve app config directory");
            return Err("Failed to resolve app config directory");
        }
    };

    match path.try_exists() {
        Ok(true) => match std::fs::File::options().write(true).open(&path) {
            Ok(file) => file,
            Err(err) => {
                log::warn!("Failed to open existing config file: {}", err);
                return Err("Failed to open existing config file");
            }
        },
        Err(_) | Ok(false) => {
            log::info!("Config file does not exist");
            log::info!("Recovering by creating one with default settings");

            log::info!("Creating default settings object");
            let default_settings = crate::models::AppSettings::default();

            log::info!("Serializing default settings to JSON");
            let json_string = match serde_json::to_string_pretty(&default_settings) {
                Ok(json_string) => json_string,
                Err(err) => {
                    log::warn!("Failed to serialize default settings: {}", err);
                    return Err("Failed to serialize default settings");
                }
            };
            log::info!("Default settings serialized");

            log::info!("Creating an empty config file");
            match std::fs::File::create(&path) {
                Ok(mut file) => {
                    log::info!("Writing default settings to file");
                    match file.write_all(json_string.as_bytes()) {
                        Ok(()) => file,
                        Err(err) => {
                            log::warn!("Failed to write default settings to file: {}", err);
                            return Err("Failed to write default settings to file");
                        }
                    }
                }
                Err(err) => {
                    log::warn!("Failed to create config file: {}", err);
                    return Err("Failed to create config file");
                }
            }
        }
    };

    Ok(path)
}

#[tauri::command]
pub fn open_secret_dir(handle: tauri::AppHandle) -> Result<(), String> {
    let path = get_secret_path(&handle).map_err(|err| err.to_string())?;
    log::info!("Opening secret dir");
    match opener::open(path) {
        Ok(_) => Ok(()),
        Err(err) => {
            log::error!("Failed to open secret dir: {}", err);
            Err(err.to_string())
        }
    }
}

#[tauri::command]
pub fn open_setting_file(handle: tauri::AppHandle) -> Result<(), String> {
    let path = get_setting_file(&handle).map_err(|err| err.to_string())?;
    log::info!("Opening setting file");
    match opener::open(path) {
        Ok(_) => Ok(()),
        Err(err) => {
            log::error!("Failed to open setting file: {}", err);
            Err(err.to_string())
        }
    }
}

#[tauri::command]
pub fn open_log_dir(handle: tauri::AppHandle) -> Result<(), String> {
    let path = get_log_path(&handle).map_err(|err| err.to_string())?;
    log::info!("Opening log dir");
    match opener::open(path) {
        Ok(_) => Ok(()),
        Err(err) => {
            log::error!("Failed to open log dir: {}", err);
            Err(err.to_string())
        }
    }
}

#[tauri::command]
pub fn open_href(href: String) -> Result<(), String> {
    log::info!("Opening href: {}", href);
    match opener::open_browser(href) {
        Ok(()) => Ok(()),
        Err(err) => {
            log::error!("Failed to open href: {}", err);
            Err(err.to_string())
        }
    }
}
