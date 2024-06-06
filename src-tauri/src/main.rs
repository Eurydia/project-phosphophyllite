// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod data;
mod pref;
mod secrets;
mod shell;

use tauri::generate_handler;

fn main() {
    tauri::Builder::default()
        .invoke_handler(generate_handler![
            pref::get_pref_repo,
            pref::set_pref_repo,
            pref::get_pref_issue,
            pref::set_pref_issue,
            secrets::get_app_id,
            secrets::get_private_key,
            secrets::get_installation_id,
            data::get_data_misc,
            data::set_data_misc,
            shell::open_url,
            shell::open_secret_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
