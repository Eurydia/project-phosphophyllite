macro_rules! log_and_return_err {
    ($) => {};
}

async fn open_db(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    let path = crate::paths::get_db_path(handle);
    log::trace!("Checking database directory");
    match &path.try_exists() {
        Ok(true) => (),
        Ok(false) => {
            log::trace!("Creating database directory since it does not exist");
            match std::fs::create_dir_all(&path) {
                Ok(_) => (),
                Err(err) => {
                    return Err(log::error!("Cannot create database directory: {}", err));
                }
            }
        }
        Err(err) => {
            let msg = "Cannot check if database directory exists";
            log::error!("{}: {}", &msg, err);
            return Err(&msg);
        }
    }
    path.push("db");
    path.set_extension("sqlite3");

    match path.try_exists() {
        Ok(true) => (),
        Ok(false) => {
            log::trace!("Creating database since it does not exist");
            match std::fs::File::create(&path) {
                Ok(_) => (),
                Err(err) => {
                    log::error!("Error found while trying to create database: {}", err);
                    return Err("Something went wrong while trying to create database");
                }
            }
        }
        Err(err) => {
            log::error!(
                "Error found while trying to check if database exists: {}",
                err
            );
            return Err("Something went wrong while trying to check if database exists");
        }
    };
}

/// Prepare database connection pool
async fn get_db_pool(app: tauri::App) -> Result<sqlx::Pool<sqlx::Sqlite>, &'static str> {
    log::trace!("Preparing path to database");

    let pool = sqlx::sqlite::SqlitePoolOptions::new().connect(path);
    match pool.await {
        Ok(pool) => Ok(pool),
        Err(err) => {
            log::error!("Error found while trying to connect to database: {}", err);
            Err("Something went wrong while trying to connect to database")
        }
    }
}

pub async fn setup_db(app: &tauri::App) -> Result<Pool<Sqlite>, &'static str> {
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
