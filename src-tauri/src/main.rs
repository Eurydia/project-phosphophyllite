// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
mod database;
mod github;
mod models;
mod paths;
mod secrets;
mod settings;
mod temp;

struct AppState {
    db: sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    octocrab: octocrab::Octocrab,
}

#[tokio::main]
async fn main() {
    let app = match tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([
                    tauri_plugin_log::LogTarget::LogDir,
                    tauri_plugin_log::LogTarget::Stdout,
                    tauri_plugin_log::LogTarget::Webview,
                ])
                .level(log::LevelFilter::Debug)
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
            settings::revert_app_settings,
            temp::open_in_editor,
            paths::open_log_dir,
            paths::open_secret_dir,
            paths::open_setting_file,
            paths::open_href,
        ])
        .build(tauri::generate_context!())
    {
        Ok(app) => app,
        Err(err) => {
            log::error!("Error found while trying to build app: {}", err);
            return;
        }
    };

    log::trace!("Preparing state manager");
    let db = crate::database::setup::setup_db(&app).await;
    let octocrab = match crate::github::setup::setup_octocrab(app.app_handle()) {
        Ok(octocrab) => octocrab,
        Err(err) => {
            log::error!("Error found while trying to setup octocrab: {}", err);
            return;
        }
    };
    app.manage(AppState { db, octocrab });

    log::trace!("Running app");
    app.run(|_, _| {});
}
