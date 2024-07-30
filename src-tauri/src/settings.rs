/// Needed when populating the initial settings or reverting to the default settings in case of corruption.
#[tauri::command]
pub fn revert_app_settings(handle: tauri::AppHandle) -> Result<(), &'static str> {
    log::trace!("Getting path");
    let path = match crate::paths::get_setting_path(handle) {
        Ok(path) => path,
        Err(err) => {
            log::error!("Failed to get path: {}", err);
            return Err("Failed to get path");
        }
    };

    log::trace!("Serializing settings");
    let content = match serde_json::to_string_pretty(&crate::models::AppSettings::default()) {
        Ok(json_str) => json_str,
        Err(err) => {
            log::error!("Failed to serialize: {}", err);
            return Err("Failed to serialize settings");
        }
    };

    log::trace!("Writing content");
    match std::fs::write(&path, content) {
        Ok(_) => Ok(()),
        Err(err) => {
            log::error!("Failed to write content: {}", err);
            Err("Failed to write content")
        }
    }
}

pub fn get_app_settings(
    handle: tauri::AppHandle,
) -> Result<crate::models::AppSettings, &'static str> {
    log::trace!("Getting path");
    let path = match crate::paths::get_setting_path(handle) {
        Ok(path) => path,
        Err(err) => {
            log::error!("Failed to get path: {}", err);
            return Err("Failed to get path");
        }
    };

    log::trace!("Reading content");
    let content = match std::fs::read_to_string(&path) {
        Ok(file_content) => file_content,
        Err(err) => {
            log::error!("Failed to read content: {}", err);
            return Err("Failed to read content");
        }
    };

    log::info!("Deserializing content");
    match serde_json::from_str(&content) {
        Ok(app_settings) => Ok(app_settings),
        Err(err) => {
            log::error!("Failed to deserialize: {}", err);
            Err("Failed to deserialize settings")
        }
    }
}
