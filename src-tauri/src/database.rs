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
        std::fs::create_dir_all(&migration_path).unwrap()
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

#[tauri::command]
pub async fn update_repository_table(
    state: tauri::State<'_, crate::AppState>,
) -> Result<(), String> {
    let db = &state.db;
    let crab = &state.octocrab;

    let items = crate::github::get_repositories(crab.to_owned()).await;

    let reqs = items.into_iter().map(|item| {
        let db = db.clone();
        async move {
            let readme = crate::github::get_repository_readme(crab.to_owned(), item.clone()).await;

            
            sqlx::query(
                r#"
                INSERT OR REPLACE INTO repositories (id, name, full_name, visibility, archived, pushed_at, created_at, updated_at, html_url, description, readme)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                "#,
            )
                .bind(&item.id.to_string())
                .bind(&item.name)
                .bind(&item.full_name)
                .bind(&item.visibility)
                .bind(&item.archived)
                .bind(&item.pushed_at.unwrap().to_string())
                .bind(&item.created_at.unwrap().to_string())
                .bind(&item.updated_at.unwrap().to_string())
                .bind(&item.html_url.unwrap().as_str().to_string())
                .bind(&item.description)
                .bind(readme)
                .execute(&db)
                .await
                .unwrap();
        }
    });
    futures::future::join_all(reqs).await;
    Ok(())
}

#[tauri::command]
pub async fn get_repositories(state: tauri::State<'_, crate::AppState>) -> Result<(), String> {
    let db = &state.db;

    let items = sqlx::query_as!(
        crate::database::AppRepository,
        r#"
        SELECT *
        FROM repositories 
        "#,
    )
    .fetch_one(db).await.unwrap();

    dbg!(items);

    Ok(())
}

// #[tauri::command]
// pub async fn update_issue_table(state: tauri::State<'_, crate::AppState>) -> Result<(), String> {
//     let db = &state.db;
//     let crab = &state.octocrab;

//     let items = crate::github::get_repositories(crab.to_owned()).await;

//     let reqs = items.into_iter().map(|item| {
//         let db = db.clone();
//         async move {
//             let readme = crate::github::get_repository_readme(crab.to_owned(), item.clone()).await;

//             sqlx::query(
//                 r#"
//                 INSERT OR REPLACE INTO repositories (
//                   id,
//                   name,
//                   fullName,
//                   visibility,
//                   status,
//                   pushedAt,
//                   createdAt,
//                   updatedAt,
//                   readme,
//                   htmlUrl,
//                   description
//                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
//               "#,
//             )
//             .bind(item.id.to_string())
//             .bind(item.name)
//             .bind(item.full_name)
//             .bind(item.visibility)
//             .bind(if item.archived.unwrap() {
//                 "archived"
//             } else {
//                 "active"
//             })
//             .bind(item.pushed_at.unwrap().to_string())
//             .bind(item.created_at.unwrap().to_string())
//             .bind(item.updated_at.unwrap().to_string())
//             .bind(readme)
//             .bind(item.html_url.unwrap().to_string())
//             .bind(item.description)
//             .execute(&db)
//             .await
//             .unwrap();
//         }
//     });
//     futures::future::join_all(reqs).await;
//     Ok(())
// }

// #[tauri::command]
// pub async fn update_repository_table(
//     state: tauri::State<'_, crate::AppState>,
// ) -> Result<(), String> {
//     let db = &state.db;
//     let crab = &state.octocrab;

//     let items = crate::github::get_repositories(crab.to_owned()).await;

//     let reqs = items.into_iter().map(|item| {
//         let db = db.clone();
//         async move {
//             let readme = crate::github::get_repository_readme(crab.to_owned(), item.clone()).await;

//             sqlx::query(
//                 r#"
//                 INSERT OR REPLACE INTO repositories (
//                   id,
//                   name,
//                   fullName,
//                   visibility,
//                   status,
//                   pushedAt,
//                   createdAt,
//                   updatedAt,
//                   readme,
//                   htmlUrl,
//                   description
//                 ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);
//               "#,
//             )
//             .bind(item.id.to_string())
//             .bind(item.name)
//             .bind(item.full_name)
//             .bind(item.visibility)
//             .bind(if item.archived.unwrap() {
//                 "archived"
//             } else {
//                 "active"
//             })
//             .bind(item.pushed_at.unwrap().to_string())
//             .bind(item.created_at.unwrap().to_string())
//             .bind(item.updated_at.unwrap().to_string())
//             .bind(readme)
//             .bind(item.html_url.unwrap().to_string())
//             .bind(item.description)
//             .execute(&db)
//             .await
//             .unwrap();
//         }
//     });
//     futures::future::join_all(reqs).await;
//     Ok(())
// }
