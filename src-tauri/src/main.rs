// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, fs};

use tauri::generate_handler;

#[tauri::command]
fn get_app_id(handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/secrets/APP_ID.txt")
        .expect("failed to resolve resource");

    match fs::read_to_string(&resource_path) {
        Ok(content) => return content,
        Err(_) => {
            println!(
                "Cannot open file. Obtain private key from app installation https://github.com/settings/apps/<app-name>."
            );
            return String::default();
        }
    }
}

#[tauri::command]
fn get_installation_id(handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/secrets/INSTALLATION_ID.txt")
        .expect("failed to resolve resource");

    match fs::read_to_string(&resource_path) {
        Ok(content) => return content,
        Err(_) => {
            println!("Cannot open file. Obtain installation id from https://github.com/settings/installations/<installation-id>");
            return String::default();
        }
    }
}

#[tauri::command]
fn get_private_key(handle: tauri::AppHandle) -> String {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/secrets/PRIVATE_KEY.txt")
        .expect("failed to resolve resource");

    match fs::read_to_string(&resource_path) {
        Ok(content) => return content,
        Err(_) => {
            println!(
                "Cannot open file. Obtain private key from app installation https://github.com/settings/apps/<app-name>."
            );
            return String::default();
        }
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(generate_handler![
            get_private_key,
            get_app_id,
            get_installation_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
