use std::io::Write;

pub fn get_temp_path(handle: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    let path = handle
        .path_resolver()
        .app_local_data_dir()
        .ok_or(String::from("Failed to resolve app local data directory"))?;

    let temp_path = path.join("temp");

    match temp_path.try_exists() {
        Ok(true) => (),
        Err(_) | Ok(false) => std::fs::create_dir_all(&temp_path)
            .map_err(|_| String::from("Failed to create directory for temp files"))?,
    }

    Ok(temp_path)
}

pub fn get_secret_path(handle: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    let path = handle
        .path_resolver()
        .app_local_data_dir()
        .ok_or(String::from("Failed to resolve app local data directory"))?;

    let secret_path = path.join("secrets");

    match secret_path.try_exists() {
        Ok(true) => (),
        Err(_) | Ok(false) => std::fs::create_dir_all(&secret_path)
            .map_err(|_| String::from("Failed to create directory for secrets"))?,
    }

    Ok(secret_path)
}

pub fn get_setting_path(handle: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    let path = handle
        .path_resolver()
        .app_config_dir()
        .ok_or("Failed to resolve app config directory")?;

    let config_path = path.join("settings.json");

    match config_path.try_exists() {
        Ok(true) => (),
        Err(_) | Ok(false) => {
            let data = crate::models::AppData::default();

            let json_string = serde_json::to_string_pretty(&data).map_err(|_| {
                String::from("Failed to serialize default config settings to json string")
            })?;

            let mut file = std::fs::File::create(&config_path)
                .map_err(|_| String::from("Failed to create config file"))?;

            file.write_all(json_string.as_bytes())
                .map_err(|_| String::from("Failed to write default settings to config file"))?;
        }
    }

    Ok(config_path)
}

#[tauri::command]
pub fn open_secret_path(handle: tauri::AppHandle) -> Result<(), String> {
    let path = get_secret_path(&handle)?;
    opener::open(path).map_err(|err| err.to_string())
}

#[tauri::command]
pub fn open_setting_path(handle: tauri::AppHandle) -> Result<(), String> {
    let path = get_setting_path(&handle)?;
    opener::open(path).map_err(|err| err.to_string())
}

#[tauri::command]
pub fn open_href(href: String) -> Result<(), String> {
    opener::open_browser(href).map_err(|err| err.to_string())
}
