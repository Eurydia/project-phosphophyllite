use sqlx::{migrate::Migrator, Pool, Sqlite};

async fn get_db_pool(app: &tauri::App) -> sqlx::Pool<sqlx::Sqlite> {
    let mut path = app
        .path_resolver()
        .app_local_data_dir()
        .expect("Failed to get app local data directory")
        .join("database");
    if !path.exists() {
        std::fs::create_dir_all(&path).expect("Failed to create database directory");
    }
    path.push("db");
    path.set_extension("sqlite3");

    if !path
        .try_exists()
        .expect("Failed to check if database file exists")
    {
        std::fs::File::create(&path).expect("Failed to create database file");
    }

    let db = sqlx::sqlite::SqlitePoolOptions::new()
        .connect(path.to_str().unwrap())
        .await
        .expect("Failed to connect to database");
    db
}

pub async fn setup_db(app: &tauri::App) -> Pool<Sqlite> {
    let migration_path = app
        .path_resolver()
        .resource_dir()
        .expect("Failed to get resource directory")
        .join("resources")
        .join("migrations");

    if !migration_path.try_exists().unwrap() {
        std::fs::create_dir_all(&migration_path).expect("Failed to create migration directory");
    }
    let db = get_db_pool(app).await;

    Migrator::new(migration_path)
        .await
        .expect("Failed to create migrator")
        .run(&db)
        .await
        .expect("Failed to run migrations");

    db
}
