// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{env, fs, path::Path};

use tauri::generate_handler;

#[tauri::command]
fn get_app_id() -> String {
    let path = Path::new("./secrets/APP_ID.txt");
    match fs::read_to_string(path) {
        Ok(content) => return content,
        Err(_) => {
            return String::default();
        }
    }
}

#[tauri::command]
fn get_installation_id() -> String {
    let path = Path::new("./secrets/INSTALLATION_ID.txt");
    match fs::read_to_string(path) {
        Ok(content) => return content,
        Err(_) => {
            return String::default();
        }
    }
}

#[tauri::command]
fn get_private_key() -> String {
    let path = Path::new("./secrets/PRIVATE_KEY.txt");
    match fs::read_to_string(path) {
        Ok(content) => return content,
        Err(_) => {
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
