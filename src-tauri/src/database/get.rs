use futures::TryStreamExt;
use sqlx::{migrate::Migrator, Pool, Sqlite};

use crate::model::{AppIssue, AppRepository};

#[tauri::command]
pub async fn get_repositories(
    state: tauri::State<'_, crate::AppState>,
) -> Result<Vec<AppRepository>, String> {
    let items: Vec<AppRepository> = sqlx::query_as::<_, AppRepository>(
        r#"
        SELECT * 
        FROM repositories"#,
    )
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
    let items: Vec<AppIssue> = sqlx::query_as::<_, AppIssue>(
        r#"
    SELECT * 
    FROM issues
    "#,
    )
    .fetch(&state.db)
    .try_collect()
    .await
    .unwrap();
    Ok(items)
}

#[tauri::command]
pub async fn get_issues_in_repository(
    state: tauri::State<'_, crate::AppState>,
    repo_full_name: String,
) -> Result<Vec<AppIssue>, String> {
    let items: Vec<AppIssue> = sqlx::query_as::<_, AppIssue>(
        "
    SELECT * 
    FROM issues 
    WHERE repo_full_name = ?",
    )
    .bind(&repo_full_name)
    .fetch(&state.db)
    .try_collect()
    .await
    .unwrap();
    Ok(items)
}

#[tauri::command]
pub async fn get_issue_in_repository_with_number(
    state: tauri::State<'_, crate::AppState>,
    repo_full_name: String,
    number: i64,
) -> Result<Vec<Option<AppIssue>>, String> {
    let items: Vec<AppIssue> = sqlx::query_as::<_, AppIssue>(
        r#"
    SELECT * 
    FROM issues 
    WHERE 
        repo_full_name = ? AND 
        number = ?
    LIMIT 1
    "#,
    )
    .bind(&repo_full_name)
    .bind(&number)
    .fetch_optional(&state.db)
    .try_collect()
    .await
    .unwrap();
    Ok(items)
}

#[tauri::command(rename_all = "camelCase")]
pub async fn get_comments_in_issue(
    state: tauri::State<'_, crate::AppState>,
    issue_id: i64,
) -> Result<Vec<AppComment>, sqlx::Error> {
    let items: Vec<AppComment> = sqlx::query_as::<_, AppComment>(
        r#"
    SELECT * 
    FROM comments 
    WHERE issue_id = ?
    "#,
    )
    .bind(issue_id)
    .fetch(db)
    .try_collect()
    .await?;
    Ok(items)
}
