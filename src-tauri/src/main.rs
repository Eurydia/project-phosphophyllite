// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod data;
mod pref;
mod secrets;
mod shell;

use tauri::generate_handler;

fn main() {
    tauri::Builder::default()
        // .setup(setup_handler)
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

// fn setup_handler(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error + 'static>> {
//     let app_handle = app.handle();
//     let config_preference_path = app_handle
//         .path_resolver()
//         .app_config_dir()
//         .unwrap()
//         .join("preferences");

//     if !std::path::Path::exists(&config_preference_path) {
//         std::fs::create_dir_all(&config_preference_path).unwrap();
//     }

//     // println!(
//     //     "{}",
//     //     app_handle
//     //         .path_resolver()
//     //         .resource_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     app_handle
//     //         .path_resolver()
//     //         .app_config_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     app_handle
//     //         .path_resolver()
//     //         .app_data_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     app_handle
//     //         .path_resolver()
//     //         .app_local_data_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     app_handle
//     //         .path_resolver()
//     //         .app_cache_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     app_handle
//     //         .path_resolver()
//     //         .app_log_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::data_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::local_data_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::cache_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::config_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::executable_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::public_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::runtime_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::template_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::font_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::home_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::audio_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::desktop_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::document_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::download_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     // println!(
//     //     "{}",
//     //     tauri::api::path::picture_dir()
//     //         .unwrap_or(std::path::PathBuf::new())
//     //         .to_string_lossy()
//     // );
//     Ok(())
// }
