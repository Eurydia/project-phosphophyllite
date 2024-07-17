pub fn get_temp_path(handle: &tauri::AppHandle) -> Result<std::path::PathBuf, String> {
    let mut path = handle
        .path_resolver()
        .app_local_data_dir()
        .ok_or("Cannot get  local app data dir.")?;
    path = path.join("temp");

    match path.try_exists() {
        Ok(true) => Ok(path),
        Err(_) | Ok(false) => {
            std::fs::create_dir_all(&path).map_err(|err| err.to_string())?;
            Ok(path)
        }
    }
}

pub fn get_secret_path(handle: &tauri::AppHandle) -> std::path::PathBuf {
    let path = handle
        .path_resolver()
        .app_local_data_dir()
        .unwrap()
        .join("secrets");

    match path.try_exists() {
        Ok(true) => path,
        Err(_) | Ok(false) => {
            std::fs::create_dir_all(&path).unwrap();
            path
        }
    }
}

pub fn get_setting_path(handle: &tauri::AppHandle) -> std::path::PathBuf {
    let path = handle
        .path_resolver()
        .app_config_dir()
        .unwrap()
        .join("settings.json");

    match path.try_exists() {
        Ok(true) => path,
        Err(_) | Ok(false) => {
            std::fs::File::create(&path).unwrap();
            let data = crate::models::AppData::default();
            let json_string = serde_json::to_string_pretty(&data).unwrap();
            std::fs::write(&path, json_string).unwrap();
            path
        }
    }
}

#[tauri::command]
pub fn open_secret_path(handle: tauri::AppHandle) -> Result<(), String> {
    let path = get_secret_path(&handle);
    opener::open(path).map_err(|err| err.to_string())
}

#[tauri::command]
pub fn open_setting_path(handle: tauri::AppHandle) -> Result<(), String> {
    let path = get_setting_path(&handle);
    opener::open(path).map_err(|err| err.to_string())
}

#[tauri::command]
pub fn open_href(href: String) -> Result<(), String> {
    opener::open(href).map_err(|err| err.to_string())
}
