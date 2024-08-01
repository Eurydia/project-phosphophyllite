/// Resolves the path to the settings file.
///
/// This function does not actually do much since it is suppose to reduce code duplication. It unwraps the path to setting directory and joins it with the settings file name.
fn resolve_settings_file(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    let path = crate::paths::get_setting_dir(handle)?;
    Ok(path.join(crate::app::constants::SETTINGS_FILE_NAME))
}

/// Overrides the settings file with default settings.
///
/// This function resolves the path to the settings file, serializes the default settings, and writes the serialized string to the settings file.
///
/// # Error
///
/// - Tauri cannot resolve the path to the settings file,
/// - `serde_json` cannot serialize the default settings,
/// - system cannot write the JSON string to the settings file.
#[tauri::command]
pub fn revert_app_settings(handle: tauri::AppHandle) -> Result<(), &'static str> {
    let path = resolve_settings_file(handle)?;

    let content = match serde_json::to_string_pretty(&crate::models::AppSettings::default()) {
        Ok(json_str) => json_str,
        Err(err) => {
            log::error!("serde_json cannot serialize settings: \"{}\"", err);
            return Err("Cannot serialize setting");
        }
    };

    match std::fs::write(&path, &content) {
        Ok(_) => Ok(()),
        Err(err) => {
            log::error!("System cannot write settings to file: \"{}\"", err);
            Err("Cannot write settings")
        }
    }
}

/// Reads and deserializes settings.
///
/// This function resolves the path to the settings file, reads the file content, and deserializes the content to `AppSettings` struct.
///
/// # Error
///
/// - Tauri cannot resolve the path to the settings file,
/// - system cannot read file content,
/// - `serde_json` cannot deserialize the file content.
pub fn get_app_settings(
    handle: tauri::AppHandle,
) -> Result<crate::models::AppSettings, &'static str> {
    let path = resolve_settings_file(handle)?;

    let content = match std::fs::read_to_string(&path) {
        Ok(file_content) => file_content,
        Err(err) => {
            log::error!("System cannot read settings: \"{}\"", err);
            return Err("Cannot read settings");
        }
    };

    match serde_json::from_str(&content) {
        Ok(app_settings) => Ok(app_settings),
        Err(err) => {
            log::error!("serde_json cannot deserialize settings: \"{}\"", err);
            Err("Cannot deserialize settings")
        }
    }
}
