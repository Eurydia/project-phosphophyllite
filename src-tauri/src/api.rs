#[tauri::command]
pub fn should_update_db(
    handle: tauri::AppHandle,
    _: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
) -> bool {
    let path = crate::paths::get_setting_path(&handle);
    let json_string = std::fs::read_to_string(&path).unwrap();
    let settings = serde_json::from_str(&json_string).unwrap_or(crate::model::AppData::default());
    match settings.auto_update.enabled {
        false => false,
        true => {
            let dt_now = chrono::Utc::now();
            let dt_last_updated =
                match chrono::DateTime::parse_from_rfc3339(&settings.auto_update.last_updated) {
                    Ok(dt) => dt.with_timezone(&chrono::Utc),
                    Err(_) => {
                        return true;
                    }
                };
            let dt_delta = dt_now - dt_last_updated;
            dt_delta.num_seconds() > settings.auto_update.minimum_elasped_interval_second
        }
    }
}
