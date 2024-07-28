/// Fallback function to revert the app settings to default.
///
///  Should be called when the app settings file is corrupted, malformed or missing.
#[tauri::command]
pub fn revert_app_settings(handle: tauri::AppHandle) -> Result<(), String> {
    log::info!("Trying to revert app settings");

    log::info!("Trying to get file path");
    let path = match crate::paths::get_setting_file(&handle) {
        Ok(path) => {
            log::info!("Got file path");
            path
        }
        Err(err) => {
            log::error!("Error found while trying to get file path: {}", &err);
            return Err(err.to_string());
        }
    };

    log::info!("Trying to serialize default settings");
    let default_app_settings_str =
        match serde_json::to_string_pretty(&crate::models::AppSettings::default()) {
            Ok(default_app_settings) => {
                log::info!("Serialization successful");
                default_app_settings
            }
            Err(err) => {
                log::error!(
                    "Error found while trying to serialize default settings: {}",
                    err
                );
                return Err(err.to_string());
            }
        };

    log::info!("Trying to write serialized settings to file");
    match std::fs::write(&path, default_app_settings_str) {
        Ok(_) => {
            log::info!("Write successful");
            log::info!("Settings reverted");
            Ok(())
        }
        Err(err) => {
            log::error!("Error found while trying to write to file: {}", err);
            Err(err.to_string())
        }
    }
}

/// Returns an `AppSettings` object.
/// In case of an error, it returns a default `AppSettings` object.
pub fn get_app_settings(handle: &tauri::AppHandle) -> Result<crate::models::AppSettings, String> {
    log::info!("Trying to prepare app settings");

    log::info!("Trying to get file path");
    let path = match crate::paths::get_setting_file(&handle) {
        Ok(path) => {
            log::info!("Got file path");
            path
        }
        Err(err) => {
            log::error!("Error found while trying to get file path: {}", &err);
            return Ok(crate::models::AppSettings::default());
        }
    };
    log::info!("Trying to read content");
    let file_content = match std::fs::read_to_string(&path) {
        Ok(file_content) => {
            log::info!("Read successful");
            file_content
        }
        Err(err) => {
            log::warn!("Error found while trying to read content: {}", err);
            return Ok(crate::models::AppSettings::default());
        }
    };

    log::info!("Trying to deserialize content");
    match serde_json::from_str(&file_content) {
        Ok(app_settings) => {
            log::info!("Deserialization successful");
            Ok(app_settings)
        }
        Err(err) => {
            log::warn!("Error found while trying to deserialize content: {}", err);
            Ok(crate::models::AppSettings::default())
        }
    }
}
