// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
mod config;
mod database;
mod github;
mod models;
mod paths;
mod secrets;
mod temp;

struct AppState {
    db: sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    octocrab: octocrab::Octocrab,
}

#[tokio::main]
async fn main() {
    let app = tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([
                    tauri_plugin_log::LogTarget::LogDir,
                    tauri_plugin_log::LogTarget::Stdout,
                    tauri_plugin_log::LogTarget::Webview,
                ])
                .log_name(dbg!(chrono::Utc::now().format("%Y-%m-%d").to_string()))
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            github::put::put_repository_readme,
            github::patch::patch_repository_description,
            database::get::get_repositories,
            database::get::get_repository_with_full_name,
            database::get::get_issues,
            database::get::get_issues_in_repository,
            database::get::should_update_db,
            database::get::get_issue_in_repository_with_number,
            database::get::get_comments,
            database::get::get_comments_in_issue,
            database::update::update_db,
            temp::open_in_editor,
            paths::open_log_dir,
            paths::open_secret_dir,
            paths::open_setting_file,
            paths::open_href,
        ])
        .build(tauri::generate_context!())
        .expect("App instance should be ready");
    log::trace!("App is ready");

    log::trace!("Adding state manager");
    let db = crate::database::setup::setup_db(&app).await;
    let octocrab = crate::github::setup::setup_octocrab(app.app_handle());
    app.manage(AppState { db, octocrab });
    log::trace!("State manager is ready");

    log::trace!("Running app");
    app.run(|_, _| {})
}
