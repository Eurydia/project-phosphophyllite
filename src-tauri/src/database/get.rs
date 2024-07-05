use crate::model::{AppComment, AppIssue, AppRepository};
use futures::TryStreamExt;

#[tauri::command]
pub async fn get_repositories(
    state: tauri::State<'_, crate::AppState>,
) -> Result<Vec<AppRepository>, String> {
    let items: Vec<AppRepository> = sqlx::query_as::<_, AppRepository>(
        r#"
        SELECT * 
        FROM repositories
        "#,
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
        r#"
        SELECT *
        FROM repositories
        WHERE full_name = ?
        LIMIT 1
        "#,
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

#[tauri::command(rename_all = "camelCase")]
pub async fn get_issues_in_repository(
    state: tauri::State<'_, crate::AppState>,
    repository_url: String,
) -> Result<Vec<AppIssue>, String> {
    let items: Vec<AppIssue> = sqlx::query_as::<_, AppIssue>(
        r#"
        SELECT *
        FROM issues
        WHERE repository_url = ?
        "#,
    )
    .bind(repository_url)
    .fetch(&state.db)
    .try_collect()
    .await
    .unwrap();
    Ok(items)
}

#[tauri::command(rename_all = "camelCase")]
pub async fn get_issue_in_repository_with_number(
    state: tauri::State<'_, crate::AppState>,
    repository_url: String,
    number: i64,
) -> Result<Option<AppIssue>, String> {
    let items: Option<AppIssue> = sqlx::query_as::<_, AppIssue>(
        r#"
        SELECT *
        FROM issues
        WHERE
            repository_url = ? AND
            number = ?
        LIMIT 1
        "#,
    )
    .bind(repository_url)
    .bind(number)
    .fetch_optional(&state.db)
    .await
    .unwrap();
    Ok(items)
}

#[tauri::command(rename_all = "camelCase")]
pub async fn get_comments(
    state: tauri::State<'_, crate::AppState>,
) -> Result<Vec<AppComment>, String> {
    let items: Vec<AppComment> = sqlx::query_as::<_, AppComment>(
        r#"
        SELECT *
        FROM comments
        "#,
    )
    .fetch(&state.db)
    .try_collect()
    .await
    .unwrap();

    Ok(items)
}

#[tauri::command(rename_all = "camelCase")]
pub async fn get_comments_in_issues(
    state: tauri::State<'_, crate::AppState>,
    issue_url: String,
) -> Result<Vec<AppComment>, String> {
    let items: Vec<AppComment> = sqlx::query_as::<_, AppComment>(
        r#"
        SELECT *
        FROM comments
        WHERE issue_url = ?
        "#,
    )
    .bind(issue_url)
    .fetch(&state.db)
    .try_collect()
    .await
    .unwrap();

    Ok(items)
}
