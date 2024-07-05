use sqlx::{migrate::Migrator, Pool, Sqlite};

async fn get_db(app: &tauri::App) -> Pool<Sqlite> {
    let mut path = app
        .path_resolver()
        .app_local_data_dir()
        .unwrap()
        .join("database");
    if !path.exists() {
        std::fs::create_dir_all(&path).unwrap();
    }
    path.push("db");
    path.set_extension("sqlite3");

    if !path.try_exists().unwrap() {
        std::fs::File::create(&path).unwrap();
    }

    let db = sqlx::sqlite::SqlitePoolOptions::new()
        .connect(path.to_str().unwrap())
        .await
        .unwrap();
    db
}

pub async fn setup_db(app: &tauri::App) -> Pool<Sqlite> {
    let migration_path = app
        .path_resolver()
        .app_local_data_dir()
        .unwrap()
        .join("database")
        .join("migrations");

    if !migration_path.try_exists().unwrap() {
        std::fs::create_dir_all(&migration_path).unwrap();
    }
    let db = get_db(app).await;

    Migrator::new(migration_path)
        .await
        .unwrap()
        .run(&db)
        .await
        .unwrap();
    db
}
