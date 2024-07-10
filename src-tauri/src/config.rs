pub fn get_user_config(handle: &tauri::AppHandle) -> crate::models::AppData {
    let path = crate::paths::get_setting_path(&handle);
    let json_string = std::fs::read_to_string(&path).unwrap();

    serde_json::from_str(&json_string).unwrap_or_else(|_| {
        let default = crate::models::AppData::default();
        let default_json_string = serde_json::to_string_pretty(&default).unwrap();

        std::fs::write(path, default_json_string).unwrap();

        default
    })
}
