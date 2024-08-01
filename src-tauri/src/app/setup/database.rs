/// Prepare database connection pool
async fn prepare_db_connection_pool(
    handle: tauri::AppHandle,
) -> Result<sqlx::Pool<sqlx::Sqlite>, &'static str> {
    {
        log::trace!("Preparing path to database");
        let dir_path = crate::paths::get_database_dir(handle.clone())?;
        let file_path = dir_path.join(crate::app::constants::DB_FILE_NAME);

        log::trace!("Converting path to string");
        let file_path_str = match file_path.to_str() {
            Some(path) => {
                log::trace!("Ok");
                path
            }
            None => {
                log::error!("Cannot convert path to string");
                return Err("Cannot convert path to string");
            }
        };

        log::trace!("Connecting to database");
        let pool = sqlx::sqlite::SqlitePoolOptions::new().connect(file_path_str);
        match pool.await {
            Ok(conn) => {
                log::trace!("Ok");
                Ok(conn)
            }
            Err(err) => {
                log::error!("Cannot connect to database: \"{}\"", err);
                Err("Cannot connect to database")
            }
        }
    }
}

/// Prepare database and run migrations
pub async fn prepare_db(app: &tauri::App) -> Result<sqlx::pool::Pool<sqlx::Sqlite>, &'static str> {
    log::trace!("Preparing database connection");
    let db = prepare_db_connection_pool(app.handle()).await?;

    let migrations_dir = crate::paths::get_migration_dir(app.handle())?;

    log::trace!(
        "Building migrator from dir: \"{}\"",
        migrations_dir.display()
    );
    let migrator = match sqlx::migrate::Migrator::new(migrations_dir).await {
        Ok(migrator) => {
            log::trace!("Ok");
            migrator
        }
        Err(err) => {
            log::error!("Cannot build migrator: \"{}\"", err);
            return Err("Cannot build migrator");
        }
    };

    log::trace!("Running migrator");
    match migrator.run(&db).await {
        Ok(_) => {
            log::trace!("Ok");
        }
        Err(err) => {
            log::error!("Cannot run migrator: \"{}\"", err);
            return Err("Cannot run migrator");
        }
    }

    Ok(db)
}
