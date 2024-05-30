// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod secrets;
mod settings;

use tauri::generate_handler;

fn main() {
    tauri::Builder::default()
        .invoke_handler(generate_handler![
            settings::get_repo_query_preferences,
            settings::set_repo_query_preferences,
            settings::get_issue_query_preferences,
            settings::set_issue_query_preferences,
            secrets::get_app_id,
            secrets::get_private_key,
            secrets::get_installation_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
