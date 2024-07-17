pub fn get_user_config(handle: &tauri::AppHandle) -> Result<crate::models::AppData, String> {
    let path = crate::paths::get_setting_path(&handle)?;
    let json_string = std::fs::read_to_string(&path).map_err(|err| err.to_string())?;

    match serde_json::from_str(&json_string) {
        Ok(data) => Ok(data),
        Err(_) => {
            let data = crate::models::AppData::default();
            let json_string = serde_json::to_string_pretty(&data).map_err(|err| err.to_string())?;

            std::fs::write(path, json_string).map_err(|err| err.to_string())?;

            Ok(data)
        }
    }
}
