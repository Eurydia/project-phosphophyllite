/// Returns an `AppSettings` object.
pub fn get_app_settings(handle: &tauri::AppHandle) -> Result<crate::models::AppSettings, String> {
    log::info!("Preparing app settings");

    log::info!("Getting file path");
    let path = match crate::paths::get_setting_file(&handle) {
        Ok(path) => path,
        Err(err) => {
            log::error!("Error found while getting path: {}", &err);
            return Err(String::from(err));
        }
    };
    log::info!("File opened. Reading content.");
    let file_content = match std::fs::read_to_string(&path) {
        Ok(file_content) => {
            log::info!("Successfully read content.");
            file_content
        }
        Err(err) => {
            log::warn!("Error found while reading content: {}.", err);
            log::info!("Failed to read content. Trying to recover by using default settings");
            return Ok(crate::models::AppSettings::default());
        }
    };

    log::info!("Deserializing content.");
    match serde_json::from_str(&file_content) {
        Ok(app_settings) => {
            log::info!("Successfully deserialized content.");
            Ok(app_settings)
        }
        Err(err) => {
            log::warn!(
                "Error found while deserializing content: {}. Trying to recover by overriding.",
                err
            );
            let default_app_settings = match serde_json::to_string_pretty(
                &crate::models::AppSettings::default(),
            ) {
                Ok(default_app_settings) => default_app_settings,
                Err(err) => {
                    log::error!(
                        "Error found while trying to serialize default settings: {}. Default setting is not ready for override. Skipping.",
                        err
                    );
                    return Ok(default_app_settings);
                }
            };
            match std::fs::write(&path, default_app_settings) {
                Ok(_) => {
                    log::info!("Successfully override content.");
                }
                Err(err) => {
                    log::error!(
                        "Error found while trying to override content: {}. Cannot override content.Skipping.",
                        err
                    );
                }
            }
            Ok(default_app_settings)
        }
    }
}
