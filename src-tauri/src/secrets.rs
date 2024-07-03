use std::fs::{create_dir_all, read_to_string, File};

fn get_secret(handle: &tauri::AppHandle, file_path: &str) -> String {
    let path = handle
        .path_resolver()
        .app_local_data_dir()
        .unwrap()
        .join("secrets");
    if !path.try_exists().unwrap() {
        create_dir_all(&path).unwrap();
    }
    let file = path.join(file_path);
    if !file.try_exists().unwrap() {
        File::create(&file).unwrap();
    }
    read_to_string(file).unwrap_or(String::default())
}

pub fn get_app_id(handle: &tauri::AppHandle) -> String {
    get_secret(handle, "APP_ID.txt")
}

pub fn get_installation_id(handle: &tauri::AppHandle) -> String {
    get_secret(handle, "INSTALLATION_ID.txt")
}

pub fn get_rsa_private_key(handle: &tauri::AppHandle) -> String {
    get_secret(handle, "RSA_PRIVATE_KEY.pem")
}
