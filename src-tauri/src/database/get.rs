use futures::TryStreamExt;

#[tauri::command]
pub fn should_update_db(
    handle: tauri::AppHandle,
    _: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
) -> Result<bool, String> {
    let user_config = crate::config::get_user_config(&handle)?;

    if !user_config.auto_update.enabled {
        return Ok(false);
    }

    let dt_now = chrono::Utc::now();
    let dt_last_updated =
        chrono::DateTime::parse_from_rfc3339(&user_config.auto_update.last_updated)
            .map_err(|err| err.to_string())?;

    let dt_delta = dt_now - dt_last_updated.with_timezone(&chrono::Utc);
    let should_update =
        dt_delta.num_seconds() > user_config.auto_update.minimum_elasped_interval_second;

    Ok(should_update)
}

#[tauri::command]
pub async fn get_repositories(
    state: tauri::State<'_, crate::AppState>,
) -> Result<Vec<crate::models::AppRepository>, String> {
    let items: Vec<crate::models::AppRepository> =
        sqlx::query_as::<_, crate::models::AppRepository>(
            r#"
        SELECT * 
        FROM repositories
        ORDER BY full_name ASC
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
    owner_name: String,
    repository_name: String,
) -> Result<Option<crate::models::AppRepository>, String> {
    let item: Option<crate::models::AppRepository> =
        sqlx::query_as::<_, crate::models::AppRepository>(
            r#"
        SELECT *
        FROM repositories
        WHERE full_name = ?
        LIMIT 1
        "#,
        )
        .bind(format!("{}/{}", owner_name, repository_name))
        .fetch_optional(&state.db)
        .await
        .unwrap();

    Ok(item)
}

#[tauri::command]
pub async fn get_issues(
    state: tauri::State<'_, crate::AppState>,
) -> Result<Vec<crate::models::AppIssue>, String> {
    let items: Vec<crate::models::AppIssue> = sqlx::query_as::<_, crate::models::AppIssue>(
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
    _: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
    repository_url: String,
) -> Result<Vec<crate::models::AppIssue>, String> {
    let items: Vec<crate::models::AppIssue> = sqlx::query_as::<_, crate::models::AppIssue>(
        r#"
        SELECT *
        FROM issues
        WHERE 
            repository_url = ?
        ORDER BY number ASC
        "#,
    )
    .bind(repository_url)
    .fetch(&state.db)
    .try_collect()
    .await
    .unwrap_or(Vec::new());

    Ok(items)
}

#[tauri::command(rename_all = "camelCase")]
pub async fn get_issue_in_repository_with_number(
    state: tauri::State<'_, crate::AppState>,
    repository_url: String,
    number: String,
) -> Result<Option<crate::models::AppIssue>, String> {
    let items: Option<crate::models::AppIssue> = sqlx::query_as::<_, crate::models::AppIssue>(
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
) -> Result<Vec<crate::models::AppComment>, String> {
    let items: Vec<crate::models::AppComment> = sqlx::query_as::<_, crate::models::AppComment>(
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
pub async fn get_comments_in_issue(
    state: tauri::State<'_, crate::AppState>,
    issue_url: String,
) -> Result<Vec<crate::models::AppComment>, String> {
    let items: Vec<crate::models::AppComment> = sqlx::query_as::<_, crate::models::AppComment>(
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
