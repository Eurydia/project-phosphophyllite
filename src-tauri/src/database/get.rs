use futures::TryStreamExt;
use sqlx::{migrate::Migrator, Pool, Sqlite};

use crate::model::{AppIssue, AppRepository};

#[tauri::command]
pub async fn get_repositories(
    state: tauri::State<'_, crate::AppState>,
) -> Result<Vec<AppRepository>, String> {
    let items: Vec<AppRepository> =
        sqlx::query_as::<_, AppRepository>("SELECT * FROM repositories")
            .fetch(&state.db)
            .try_collect()
            .await
            .unwrap();
    Ok(items)
}

#[tauri::command(rename_all = "camelCase")]
pub async fn get_repository_with_full_name(
    state: tauri::State<'_, crate::AppState>,
    full_name: String,
) -> Result<Option<AppRepository>, String> {
    let item: Option<AppRepository> = sqlx::query_as::<_, AppRepository>(
        "
        SELECT * 
        FROM repositories 
        WHERE full_name = ? 
        LIMIT 1",
    )
    .bind(full_name)
    .fetch_optional(&state.db)
    .await
    .unwrap();

    Ok(item)
}

#[tauri::command]
pub async fn get_issues(state: tauri::State<'_, crate::AppState>) -> Result<Vec<AppIssue>, String> {
    let items: Vec<AppIssue> = sqlx::query_as::<_, AppIssue>("SELECT * FROM issues")
        .fetch(&state.db)
        .try_collect()
        .await
        .unwrap();
    Ok(items)
}

#[tauri::command]
pub async fn get_issues_in_repository(
    state: tauri::State<'_, crate::AppState>,
) -> Result<Vec<AppIssue>, String> {
    let items: Vec<AppIssue> = sqlx::query_as::<_, AppIssue>("SELECT * FROM issues")
        .fetch(&state.db)
        .try_collect()
        .await
        .unwrap();
    Ok(items)
}
