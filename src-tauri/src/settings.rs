macro_rules! resolve_settings_path {
    () => {{
        log::trace!("Getting path to settings");
        match crate::paths::get_setting_dir(handle) {
            Ok(path) => {
                log::trace!("Ok");
                path.join(crate::app::constants::SETTINGS_FILE_NAME)
            }
            Err(err) => {
                log::error!("Cannot get path: \"{}\"", err);
                return Err("Cannot get path");
            }
        }
    }};
}

/// Needed when populating the initial settings or reverting to the default settings in case of corruption.
#[tauri::command]
pub fn revert_app_settings(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let path = resolve_settings_path!();

    log::trace!("Serializing settings");
    let content = match serde_json::to_string_pretty(&crate::models::AppSettings::default()) {
        Ok(json_str) => {
            log::trace!("Ok");
            json_str
        }
        Err(err) => {
            log::error!("Cannot serialize settings: \"{}\"", err);
            return Err("Cannot serialize settings");
        }
    };

    log::trace!("Writing content");
    match std::fs::write(&path, content) {
        Ok(_) => {
            log::trace!("Ok");
            Ok(())
        }
        Err(err) => {
            log::error!("Cannot write content: \"{}\"", err);
            Err("Cannot write content")
        }
    }
}

pub fn get_app_settings(
    handle: tauri::AppHandle,
) -> Result<crate::models::AppSettings, &'static str> {
    let path = resolve_settings_path!();

    log::trace!("Reading content");
    let content = match std::fs::read_to_string(&path) {
        Ok(file_content) => {
            log::trace!("Ok");
            file_content
        }
        Err(err) => {
            log::error!("Cannot read content: \"{}\"", err);
            return Err("Cannot read content");
        }
    };

    log::trace!("Deserializing content");
    match serde_json::from_str(&content) {
        Ok(app_settings) => {
            log::trace!("Ok");
            Ok(app_settings)
        }
        Err(err) => {
            log::error!("Cannot deserialize settings: \"{}\"", err);
            Err("Cannot deserialize settings")
        }
    }
}
