use futures::TryStreamExt;

/// Calls by the frontend to check whether the database should be updated.
///
/// Checks the delta between the last updated time and the current time. If the delta is greater than the minimum elapsed interval, the database should be updated.
/// If an error occurs during the process, the update should be skipped.
#[tauri::command]
pub fn should_update_db(
    handle: tauri::AppHandle,
    _: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
) -> Result<bool, String> {
    log::info!("Checking if database should be updated");

    log::info!("Trying to get app settings");
    let crate::models::AppSettings { auto_update, .. } =
        match crate::settings::get_app_settings(&handle) {
            Ok(app_settings) => {
                log::info!("Got app settings");
                app_settings
            }
            Err(err) => {
                log::error!("Error found while trying to get app settings: {}", &err);
                log::info!("Should skip update");
                return Ok(false);
            }
        };

    if !auto_update.enabled {
        log::info!("Auto update disabled");
        log::info!("Should skip update");
        return Ok(false);
    }

    log::info!("Auto update enabled");
    log::info!("Trying to parse last updated time");
    let dt_last_updated = match chrono::DateTime::parse_from_rfc3339(&auto_update.last_updated) {
        Ok(dt_last_updated) => {
            log::info!("Parse successful");
            dt_last_updated
        }
        Err(err) => {
            log::error!(
                "Error found while trying to parse last updated time: {}",
                &err
            );
            log::info!("Should skip update");
            return Ok(false);
        }
    };
    let dt_now = chrono::Utc::now();
    let dt_delta = dt_now - dt_last_updated.with_timezone(&chrono::Utc);
    let should_update = dt_delta.num_seconds() > auto_update.minimum_elasped_interval_second;

    log::info!(
        "Should update the database: {}. Last updated: {:?}, Now: {:?}, Delta (seconds): {:?}, Minimum delta for update (seconds): {} ",
        should_update,
        dt_last_updated,
        dt_now,
        dt_delta,
        auto_update.minimum_elasped_interval_second
    );
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
