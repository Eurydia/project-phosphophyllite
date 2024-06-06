use std::io::Write;

#[tauri::command]
pub fn get_data_misc(handle: tauri::AppHandle) -> String {
    let resource_path_option = handle
        .path_resolver()
        .resolve_resource("./resources/data/misc.json");
    let resource_path = match resource_path_option {
        None => return String::default(),
        Some(p) => p,
    };
    let data_result = std::fs::read_to_string(resource_path);
    let data = match data_result {
        Err(_) => return String::default(),
        Ok(dt) => dt,
    };
    return data;
}

#[tauri::command]
pub fn set_data_misc(handle: tauri::AppHandle, json_string: String) {
    let path = handle
        .path_resolver()
        .resolve_resource("./resources/data")
        .unwrap();

    if !std::path::Path::exists(&path) {
        std::fs::create_dir_all(&path).unwrap();
    }

    let file_result = std::fs::OpenOptions::new()
        .create(true)
        .write(true)
        .truncate(true)
        .open(path.join("misc.json"));
    let mut file = match file_result {
        Err(_) => return,
        Ok(f) => f,
    };
    file.write_all(&json_string.as_bytes()).unwrap();
}
