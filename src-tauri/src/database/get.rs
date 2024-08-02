use futures::TryStreamExt;

macro_rules! unwrap_query_option {
    ($query:expr) => {
        match $query.await {
            Ok(item) => Ok(item),
            Err(err) => {
                log::warn!("sqlx cannot execute query: \"{}\"", err);
                Ok(None)
            }
        }
    };
}

macro_rules! unwrap_query_vec {
    ($query:expr) => {
        match $query.await {
            Ok(items) => Ok(items),
            Err(err) => {
                log::warn!("sqlx cannot execute query: \"{}\"", err);
                Ok(Vec::new())
            }
        }
    };
}

/// Checks whether the database should be updated.
///
/// This function read the settings and checks whether the auto update is enabled.
/// If it is enabled, it checks whether enough time has passed since the last update.
///
/// This function is called by the front-end once upon startup.
///
/// # Error
///
/// ## Path
///
/// The function has to use the user settings. If the function cannot access the settings, it returns an error, but retuning `Ok(false)` is also a valid choice.
///
/// ## By Chrono
///
/// The time of the last update is stored as a string in rfc3339 format, so this function uses chrono to parse it. When chrono fails to parse the string, it returns an error, but practically, returning `Ok(false)` could be a better choice.
#[tauri::command]
pub fn should_update_db(
    handle: tauri::AppHandle,
    _: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
) -> Result<bool, &'static str> {
    let crate::models::AppSettings { auto_update, .. } = crate::settings::get_app_settings(handle)?;

    if !auto_update.enabled {
        return Ok(false);
    }

    let dt_last_updated = match chrono::DateTime::parse_from_rfc3339(&auto_update.last_updated) {
        Ok(dt_last_updated) => dt_last_updated,
        Err(err) => {
            log::error!("chrono cannor parse datetime string:\"{}\"", err);
            return Err("Cannot parse datetime string");
        }
    };
    let dt_now = chrono::Utc::now();
    let dt_delta = dt_now - dt_last_updated.with_timezone(&chrono::Utc);
    let should_update = dt_delta.num_seconds() > auto_update.minimum_elasped_interval_second;
    Ok(should_update)
}

/// Get all repositories from the database sorted by full name in ascending order.
///
/// If [`sqlx`] cannot execute the query, this function logs the error and returns an empty vector.
#[tauri::command]
pub async fn get_repositories(
    state: tauri::State<'_, crate::AppState>,
) -> Result<Vec<crate::models::AppRepository>, &'static str> {
    let r#query = sqlx::query_as::<_, crate::models::AppRepository>(
        r#"
        SELECT * 
        FROM repositories
        ORDER BY full_name ASC
        "#,
    )
    .fetch(&state.db)
    .try_collect::<Vec<crate::models::AppRepository>>();

    unwrap_query_vec!(r#query)
}

/// Get a single repository from the database with the given full name.
///
/// In case of an error, this function logs the error and returns `None`.
#[tauri::command(rename_all = "camelCase")]
pub async fn get_repository_with_full_name(
    state: tauri::State<'_, crate::AppState>,
    owner_name: String,
    repository_name: String,
) -> Result<Option<crate::models::AppRepository>, &'static str> {
    let r#query = sqlx::query_as::<_, crate::models::AppRepository>(
        r#"
        SELECT *
        FROM repositories
        WHERE 
            name        = ? AND 
            owner_login = ?
        LIMIT 1
        "#,
    )
    .bind(repository_name)
    .bind(owner_name)
    .fetch_optional(&state.db);

    unwrap_query_option!(r#query)
}

/// Get all issues from the database.
///
/// If [`sqlx`] cannot execute the query, this function logs the error and returns an empty vector.
#[tauri::command]
pub async fn get_issues(
    state: tauri::State<'_, crate::AppState>,
) -> Result<Vec<crate::models::AppIssue>, &'static str> {
    let r#query = sqlx::query_as::<_, crate::models::AppIssue>(
        r#"
        SELECT *
        FROM issues
        "#,
    )
    .fetch(&state.db)
    .try_collect();

    unwrap_query_vec!(r#query)
}

/// Get all issues from the database which belong to the given repository.
///
/// If [`sqlx`] cannot execute the query, this function logs the error and returns an empty vector.
#[tauri::command(rename_all = "camelCase")]
pub async fn get_issues_in_repository(
    _: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
    repository_url: String,
) -> Result<Vec<crate::models::AppIssue>, &'static str> {
    let r#query = sqlx::query_as::<_, crate::models::AppIssue>(
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
    .try_collect();

    unwrap_query_vec!(r#query)
}

/// Get a single issue from the database with the given repository URL and issue number.
///
/// If [`sqlx`] cannot execute the query, this function logs the error and returns `None`.
#[tauri::command(rename_all = "camelCase")]
pub async fn get_issue_in_repository_with_number(
    state: tauri::State<'_, crate::AppState>,
    repository_url: String,
    number: String,
) -> Result<Option<crate::models::AppIssue>, &'static str> {
    let r#query = sqlx::query_as::<_, crate::models::AppIssue>(
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
    .fetch_optional(&state.db);

    unwrap_query_option!(r#query)
}

/// Get all comments from the database.
///
/// If [`sqlx`] cannot execute the query, this function logs the error and returns an empty vector.
#[tauri::command(rename_all = "camelCase")]
pub async fn get_comments(
    state: tauri::State<'_, crate::AppState>,
) -> Result<Vec<crate::models::AppComment>, &'static str> {
    let r#query = sqlx::query_as::<_, crate::models::AppComment>(
        r#"
        SELECT *
        FROM comments
        "#,
    )
    .fetch(&state.db)
    .try_collect();

    unwrap_query_vec!(r#query)
}

/// Get all comments from the database which belong to the given issue.
///
/// If [`sqlx`] cannot execute the query, this function logs the error and returns an empty vector.
#[tauri::command(rename_all = "camelCase")]
pub async fn get_comments_in_issue(
    state: tauri::State<'_, crate::AppState>,
    issue_url: String,
) -> Result<Vec<crate::models::AppComment>, &'static str> {
    let query = sqlx::query_as::<_, crate::models::AppComment>(
        r#"
        SELECT *
        FROM comments
        WHERE issue_url = ?
        "#,
    )
    .bind(issue_url)
    .fetch(&state.db)
    .try_collect::<Vec<crate::models::AppComment>>();

    unwrap_query_vec!(query)
}
