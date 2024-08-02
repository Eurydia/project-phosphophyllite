/// Prepare database connection pool
async fn prepare_db_connection_pool(
    handle: tauri::AppHandle,
) -> Result<sqlx::Pool<sqlx::Sqlite>, &'static str> {
    {
        let dir_path = crate::paths::get_database_dir(handle.clone())?;
        let file_path = dir_path.join(crate::app::constants::DB_FILE_NAME);

        let file_path_str = match file_path.to_str() {
            Some(path) => path,
            None => {
                log::error!("Rust cannot convert path to string");
                return Err("Cannot convert path to string");
            }
        };

        let pool = sqlx::sqlite::SqlitePoolOptions::new().connect(file_path_str);
        match pool.await {
            Ok(conn) => Ok(conn),
            Err(err) => {
                log::error!("sqlx cannot connect to database: \"{}\"", err);
                Err("Cannot connect to database")
            }
        }
    }
}

/// Prepare database and run migrations
///
/// This function prepares the database connection pool and runs the migrations.
pub async fn prepare_db(app: &tauri::App) -> Result<sqlx::pool::Pool<sqlx::Sqlite>, &'static str> {
    let db = prepare_db_connection_pool(app.handle()).await?;

    let migrations_dir = crate::paths::get_migration_dir(app.handle())?;

    let migrator = match sqlx::migrate::Migrator::new(migrations_dir).await {
        Ok(migrator) => migrator,
        Err(err) => {
            log::error!("sqlx cannot build migrator: \"{}\"", err);
            return Err("Cannot build migrator");
        }
    };

    match migrator.run(&db).await {
        Ok(_) => Ok(db),
        Err(err) => {
            log::error!("sqlx cannot run migrator: \"{}\"", err);
            Err("Cannot run migrator")
        }
    }
}
