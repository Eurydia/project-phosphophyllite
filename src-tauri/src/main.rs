// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use database::update::update_tables;
use octocrab::Octocrab;
use sqlx::{sqlite::Sqlite, Pool};
use tauri::Manager;
mod database;
mod github;
mod model;
mod secrets;

struct AppState {
    db: Pool<Sqlite>,
    octocrab: Octocrab,
}

#[tokio::main]
async fn main() {
    let app = tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            database::get::get_repositories,
            database::get::get_repository_with_full_name,
            database::get::get_issues,
            database::get::get_issues_in_repository,
            database::get::get_issue_in_repository_with_number,
            database::get::get_comments,
            database::get::get_comments_in_issues,
            database::update::update_tables,
        ])
        .build(tauri::generate_context!())
        .unwrap();

    let db = database::prep::setup_db(&app).await;
    let octocrab = github::get_octocrab(app.app_handle()).await;
    app.manage(AppState { db, octocrab });

    // update_tables(app.state()).await.unwrap();
    app.run(|_, _| {})
}
