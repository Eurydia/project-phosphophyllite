/// Resolves the path to the settings file.
///
/// This function does not actually do much since it is suppose to reduce code duplication. It unwraps the path to setting directory and joins it with the settings file name.
fn resolve_settings_file(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &str> {
    let path = crate::paths::get_setting_dir(handle)?;
    Ok(path.join(crate::app::constants::SETTINGS_FILE_NAME))
}

/// Overrides the settings file with default settings.
///
/// The function has three steps.
/// 1. resolves the path to the settings file,
/// 2. serializes the default settings to a JSON string,
/// 3. writes the JSON string to the settings file.
///
/// # Error
///
/// - when it cannot resolve the path to the settings file,
/// - when `serde_json` cannot serialize the default settings,
/// - when it cannot write the JSON string to the settings file.
#[tauri::command]
pub fn revert_app_settings(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let path = resolve_settings_file(handle)?;

    let content = match serde_json::to_string_pretty(&crate::models::AppSettings::default()) {
        Ok(json_str) => json_str,
        Err(err) => {
            log::error!(
                "serde_json failed to serialize settings for write: \"{}\"",
                err
            );
            return Err("Cannot serialize settings");
        }
    };

    match std::fs::write(&path, content) {
        Ok(_) => Ok(()),
        Err(err) => {
            log::error!(
                "System cannot write serialized content to file: \"{}\"",
                err
            );
            Err("Cannot write content")
        }
    }
}

pub fn get_app_settings(
    handle: tauri::AppHandle,
) -> Result<crate::models::AppSettings, &'static str> {
    let path = resolve_settings_file!();

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
