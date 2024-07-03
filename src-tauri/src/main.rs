// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

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
            database::update::update_repository_table,
            database::get::get_repositories,
            database::get::get_repository_with_full_name,
        ])
        .build(tauri::generate_context!())
        .unwrap();

    let db = database::prep::setup_db(&app).await;
    let octocrab = github::get_octocrab(app.app_handle()).await;
    app.manage(AppState { db, octocrab });
    app.run(|_, _| {})
}
