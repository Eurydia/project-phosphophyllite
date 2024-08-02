macro_rules! unwrap_mandatory_field {
    ($field:expr) => {
        match $field {
            Some(field) => field,
            None => {
                log::error!("Missing field \"{}\"", stringify!($field));
                return Err("Missing field");
            }
        }
    };
}

macro_rules! unwrap_optional_field {
    ($field:expr) => {
        match $field {
            Some(field) => field,
            None => String::default(),
        }
    };
}

macro_rules! unwrap_optional_field_datetime {
    ($raw_datetime:expr) => {
        match $raw_datetime {
            Some(datetime) => datetime.to_rfc3339(),
            None => String::default(),
        }
    };
}

/// Update the repository table entry in the database.
///
/// This function accepts a [`octocrab::models::Repository`] as an argument. The fields are extracted from the struct and inserted into the database.
/// Some fields in the struct are of type `Option<T>`. Some of these fields are mandatory, while others are optional.
///
/// This function also make a request to GitHub for README, since it is not included in the [`octocrab::models::Repository`] struct. As such, the request is located after other field are prepared to prevent unnecessary requests when the struct is malformed.
///
/// # Errors
///
/// - Mandatory fields are missing
/// - [`sqlx`] cannot execute the query
pub async fn update_repository_table_entry(
    db: &sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    octocrab: octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Result<(), &'static str> {
    let octocrab::models::Repository {
        name,
        full_name,
        owner,
        pushed_at,
        created_at,
        updated_at,
        private,
        archived,
        visibility,
        html_url,
        description,
        url,
        ..
    } = repository.clone();

    let url_field = &url.to_string();
    let name_field = &name;
    let full_name_field = unwrap_mandatory_field!(full_name);
    let owner_login_field = unwrap_mandatory_field!(owner).login;
    let private_field = unwrap_mandatory_field!(private);
    let archived_field = unwrap_mandatory_field!(archived);
    let visibility_field = unwrap_mandatory_field!(visibility);
    let pushed_at_field = unwrap_optional_field_datetime!(pushed_at);
    let created_at_field = unwrap_optional_field_datetime!(created_at);
    let updated_at_field = unwrap_optional_field_datetime!(updated_at);
    let description_field = unwrap_optional_field!(description);
    let html_url_field = match html_url {
        Some(html_url) => html_url.to_string(),
        None => String::default(),
    };
    let readme_field =
        crate::github::get::get_repository_readme(octocrab, repository.clone()).await?;

    let query = sqlx::query(
        r#"
        INSERT OR REPLACE INTO repositories (
            "url",
            "name" ,
            "full_name",
            "owner_login",
            "pushed_at",
            "created_at",
            "updated_at",
            "private" ,
            "archived" ,
            "visibility",
            "html_url",
            "description",
            "readme"
            )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        "#,
    )
    .bind(&url_field)
    .bind(&name_field)
    .bind(&full_name_field)
    .bind(&owner_login_field)
    .bind(&pushed_at_field)
    .bind(&created_at_field)
    .bind(&updated_at_field)
    .bind(&private_field)
    .bind(&archived_field)
    .bind(&visibility_field)
    .bind(&html_url_field)
    .bind(&description_field)
    .bind(&readme_field)
    .execute(db);

    match query.await {
        Ok(_) => Ok(()),
        Err(err) => {
            log::error!("sqlx cannot execute query: \"{}\"", err);
            Err("Cannot execute query")
        }
    }
}

/// Update the issue table entry in the database.
///
/// This function accepts a [`octocrab::models::issues::Issue`] as an argument. The fields are extracted from the struct and inserted into the database.
///
/// Some fields in the struct are of type `Option<T>`. Some of these fields are mandatory, while others are optional.
///
/// # Errors
/// - Mandatory fields are missing
/// - [`sqlx`] cannot execute the query
pub async fn update_issue_table_entry(
    db: &sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    issue: octocrab::models::issues::Issue,
) -> Result<(), &'static str> {
    let octocrab::models::issues::Issue {
        url,
        repository_url,
        title,
        body,
        state,
        number,
        html_url,
        created_at,
        updated_at,
        closed_at,
        user,
        labels,
        ..
    } = issue;

    let title_field = title;
    let user_type_field = user.r#type;
    let url_field = url.to_string();
    let number_field = number.to_string();
    let html_url_field = html_url.to_string();
    let repository_url_field = repository_url.to_string();
    let created_at_field = created_at.to_rfc3339();
    let updated_at_field = updated_at.to_rfc3339();
    let body_field = unwrap_optional_field!(body);
    let closed_at_field = unwrap_optional_field_datetime!(closed_at);
    let state_field = match state {
        octocrab::models::IssueState::Open => "open",
        octocrab::models::IssueState::Closed | _ => "closed",
    };
    let label_field = labels
        .into_iter()
        .map(|label| label.name)
        .collect::<Vec<String>>()
        .join(",");

    let query = sqlx::query(
        r#"
        INSERT OR REPLACE INTO issues (
                "url",
                "repository_url",
                "title",
                "body",
                "state",
                "number",
                "html_url",
                "created_at",
                "updated_at",
                "closed_at",
                "user_type",
                "issue_label"
            )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        "#,
    )
    .bind(&url_field)
    .bind(&repository_url_field)
    .bind(&title_field)
    .bind(&body_field)
    .bind(&state_field)
    .bind(&number_field)
    .bind(&html_url_field)
    .bind(&created_at_field)
    .bind(&updated_at_field)
    .bind(&closed_at_field)
    .bind(&user_type_field)
    .bind(&label_field)
    .execute(db);

    match query.await {
        Ok(_) => Ok(()),
        Err(err) => {
            log::error!("sqlx cannot execute query: \"{}\"", err);
            Err("Cannot execute query")
        }
    }
}

/// Update the comment table entry in the database.
///
/// This function accepts a [`octocrab::models::issues::Comment`] as an argument. The fields are extracted from the struct and inserted into the database.
///
/// Some fields in the struct are of type `Option<T>`. Some of these fields are mandatory, while others are optional.
///
/// # Errors
/// - Mandatory fields are missing
/// - [`sqlx`] cannot execute the query
pub async fn update_comment_table_entry(
    db: &sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    comment: octocrab::models::issues::Comment,
) -> Result<(), &'static str> {
    let octocrab::models::issues::Comment {
        url,
        issue_url,
        id,
        body,
        html_url,
        created_at,
        updated_at,
        ..
    } = comment.clone();

    let issue_url_field = unwrap_mandatory_field!(issue_url).to_string();
    let body_field = unwrap_optional_field!(body);
    let updated_at_field = unwrap_optional_field_datetime!(updated_at);
    let id_field = id.to_string();
    let url_field = url.to_string();
    let html_url_field = html_url.to_string();
    let created_at_field = created_at.to_rfc3339();

    let query = sqlx::query(
        r#"
        INSERT OR REPLACE INTO comments (
            url,
            issue_url,
            id,
            body,
            html_url,
            created_at,
            updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        "#,
    )
    .bind(&url_field)
    .bind(&issue_url_field)
    .bind(&id_field)
    .bind(&body_field)
    .bind(&html_url_field)
    .bind(&created_at_field)
    .bind(&updated_at_field)
    .execute(db);
    match query.await {
        Ok(_) => Ok(()),
        Err(err) => {
            log::error!("sqlx cannot execute query: \"{}\"", err);
            Err("Cannot execute query")
        }
    }
}

/// Update the database.
///
/// This function updates the database with the latest information from GitHub. It fetches all repositories, issues, and comments from GitHub and updates the database accordingly.
///
/// This function also updates the last updated field in the settings file.
///
/// # Errors
/// - [`octocrab`] cannot get repositories
/// - [`octocrab`] cannot get issues
/// - [`octocrab`] cannot get comments
/// - [`sqlx`] cannot execute the query to update repositories
/// - [`sqlx`] cannot execute the query to update issues
/// - [`sqlx`] cannot execute the query to update comments
/// - [`tauri`] cannot resolve path to settings
/// - [`serde_json`] cannot serialize settings
/// - System cannot write to file
#[tauri::command]
pub async fn update_db(
    handle: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
) -> Result<(), &'static str> {
    let db = &state.db;
    let crab = state.octocrab.clone();

    let repos = crate::github::get::get_repositories(crab.clone()).await?;
    dbg!(&repos);
    for repo in repos {
        update_repository_table_entry(db, crab.clone(), repo.clone()).await?;

        let issues = crate::github::get::get_issues(crab.clone(), repo.clone()).await?;
        for issue in issues {
            update_issue_table_entry(db, issue).await?;
        }

        let comments = crate::github::get::get_comments(crab.clone(), repo.clone()).await?;
        for comment in comments {
            update_comment_table_entry(db, comment).await?
        }
    }

    let mut user_settings = crate::settings::get_app_settings(handle.clone())?;

    user_settings.auto_update.last_updated = chrono::Utc::now().to_rfc3339();

    let json_string = match serde_json::to_string_pretty(&user_settings) {
        Ok(json_string) => json_string,
        Err(err) => {
            log::error!("serde_json cannot serialize settings: \"{}\"", err);
            return Err("Cannot serialize settings");
        }
    };

    let path = crate::paths::get_setting_dir(handle.clone())?;

    match std::fs::write(path, json_string) {
        Ok(()) => Ok(()),
        Err(err) => {
            log::error!("System cannot write to file: \"{}\"", err);
            Err("Cannot write to file")
        }
    }
}
