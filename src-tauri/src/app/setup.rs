/// Returns path to database file and creates it if necessary
fn prepare_db_file(handle: tauri::AppHandle) -> Result<&'static str, &'static str> {
    log::trace!("Preparing database file");

    let db_name = "db.sqlite3";
    let dir_path = crate::paths::get_database_dir(handle)?;
    let file_path = dir_path.join(&db_name);

    log::trace!("Checking if file exists");
    match &file_path.try_exists() {
        Ok(true) => (),
        Ok(false) => {
            log::trace!("Creating file because it is missing");
            match std::fs::File::create(&file_path) {
                Ok(_) => (),
                Err(err) => {
                    log::error!("Cannot create file: {}", err);
                    return Err("Cannot create file");
                }
            };
        }
        Err(err) => {
            log::error!("Cannot check if file exists: {}", err);
            return Err("Cannot check if file exists");
        }
    }

    Ok(&db_name)
}

/// Return path to migrations directory and creates it if necessary
fn prepare_migrations(handle: tauri::AppHandle) -> Result<std::path::PathBuf, &'static str> {
    log::trace!("Preparing migrations dir");
    let dir_path = crate::paths::get_migration_dir(handle)?;

    log::trace!("Checking if dir exists");
    match dir_path.try_exists() {
        Ok(true) => (),
        Ok(false) => {
            log::trace!("Creating dir because it is missing");
            match std::fs::create_dir_all(&dir_path) {
                Ok(_) => (),
                Err(err) => {
                    log::error!("Cannot create dir: {}", err);
                    return Err("Cannot create dir");
                }
            }
        }
        Err(err) => {
            log::error!("Cannot check if dir exists: {}", err);
            return Err("Cannot check if dir exists");
        }
    }

    Ok(dir_path)
}

/// Prepare database connection pool
async fn prepare_db_connection_pool(
    handle: tauri::AppHandle,
) -> Result<sqlx::Pool<sqlx::Sqlite>, &'static str> {
    {
        log::trace!("Preparing path to database");
        let db_name = prepare_db_file(handle)?;

        log::trace!("Connecting to database");
        let pool = sqlx::sqlite::SqlitePoolOptions::new().connect(&db_name);
        match pool.await {
            Ok(pool) => Ok(pool),
            Err(err) => {
                log::error!("Cannot connect to database: {}", err);
                Err("Cannot connect to database")
            }
        }
    }
}

pub async fn prepare_db(app: &tauri::App) -> Result<sqlx::pool::Pool<sqlx::Sqlite>, &'static str> {
    log::trace!("Setting up database");

    let db = prepare_db_connection_pool(app.handle()).await?;
    let migrations_dir = prepare_migrations(app.handle())?;

    log::trace!("Creating migrator");
    let migrator = match sqlx::migrate::Migrator::new(migrations_dir).await {
        Ok(migrator) => migrator,
        Err(err) => {
            log::error!("Cannot create migrator: {}", err);
            return Err("Cannot create migrator");
        }
    };

    log::trace!("Running migrator");
    match migrator.run(&db).await {
        Ok(_) => (),
        Err(err) => {
            log::error!("Cannot run migrator: {}", err);
            return Err("Cannot run migrator");
        }
    }

    Ok(db)
}
