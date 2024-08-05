// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
mod app;
mod database;
mod github;
mod models;
mod open;
mod paths;
mod secrets;
mod settings;

struct AppState {
    db: sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    octocrab: octocrab::Octocrab,
}

#[tokio::main]
async fn main() -> Result<(), &'static str> {
    let builder = tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([
                    tauri_plugin_log::LogTarget::LogDir,
                    tauri_plugin_log::LogTarget::Stdout,
                    tauri_plugin_log::LogTarget::Webview,
                ])
                .log_name(chrono::Utc::now().format("%Y-%m-%d").to_string())
                .build(),
        )
        .setup(|app| {
            crate::app::setup::paths::prepare_paths(app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            github::post::post_issue,
            github::post::post_comment,
            github::put::put_repository_readme,
            github::patch::patch_repository_description,
            github::patch::patch_issue_title,
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
            open::open_in_editor,
            open::open_log_dir,
            open::open_secret_dir,
            open::open_setting_file,
            open::open_href,
        ])
        .build(tauri::generate_context!());

    let app = match builder {
        Ok(app) => app,
        Err(err) => {
            log::error!("tauri cannot build app: {}", err);
            return Err("Cannot build app");
        }
    };

    let db = crate::app::setup::database::prepare_db(&app).await?;
    let octocrab = crate::app::setup::octocrab::prepare_octocrab(app.app_handle())?;
    app.manage(AppState { db, octocrab });

    app.run(|_, _| {});

    Ok(())
}
