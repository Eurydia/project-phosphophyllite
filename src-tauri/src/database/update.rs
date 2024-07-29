use futures::TryFutureExt;

macro_rules! trace_field {
    ($field:expr, $field_name:literal) => {{
        log::trace!("Trying to prepare \"{}\" field", $field_name);
        $field
    }};
}

macro_rules! log_error_and_return {
    ($field_name:literal) => {{
        log::error!(
            "Cannot continue since repository is missing \"{}\"",
            $field_name
        );
        return Err(concat!("Repository is missing \"", $field_name, "\""));
    }};
}

macro_rules! trace_mandatory_field {
    ($field:expr, $field_name:literal) => {
        trace_field!(
            match $field {
                Some(field) => field,
                None => log_error_and_return!($field_name),
            },
            $field_name
        )
    };
}

macro_rules! trace_datetime_field {
    ($field:expr, $field_name:literal) => {
        trace_field!(
            match $field {
                Some(datetime) => datetime.to_rfc3339(),
                None => {
                    log::trace!(
                        "Using empty string since repository is missing \"{}\"",
                        $field_name
                    );
                    String::default()
                }
            },
            $field_name
        )
    };
}

pub async fn update_repository_table_entry(
    db: &sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    octocrab: octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Result<(), &'static str> {
    log::trace!("Trying to update repository entry");

    let octocrab::models::Repository {
        name,
        full_name,
        owner,
        pushed_at,
        created_at,
        updated_at,
        private: r#private,
        archived: r#archived,
        visibility: r#visibility,
        html_url,
        description,
        url,
        ..
    } = repository.clone();

    log::trace!("Preparing query");

    let url_field = trace_field!(url.to_string(), "url");
    let name_field = trace_field!(name, "name");
    let readme_field = trace_field!(
        crate::github::get::get_repository_readme(octocrab, repository.clone()).await?,
        "readme"
    );
    let full_name_field = trace_mandatory_field!(full_name, "full_name");
    let owner_login_field = trace_field!(
        match owner {
            Some(owner) => owner.login,
            None => log_error_and_return!("owner"),
        },
        "owner_login"
    );
    let pushed_at_field = trace_datetime_field!(pushed_at, "pushed_at");
    let created_at_field = trace_datetime_field!(created_at, "created_at");
    let updated_at_field = trace_datetime_field!(updated_at, "updated_at");
    let private_field = trace_mandatory_field!(r#private, "private");
    let archived_field = trace_mandatory_field!(r#archived, "archived");
    let visibility_field = trace_mandatory_field!(r#visibility, "visibility");
    let description_field = trace_field!(
        match description {
            Some(description) => description,
            None => {
                log::trace!("Using empty string since repository is missing \"description\"");
                String::default()
            }
        },
        "description"
    );
    let html_url_field = trace_field!(
        match html_url {
            Some(html_url) => html_url.to_string(),
            None => {
                log::trace!("Using empty string since repository is missing \"html_url\"");
                String::default()
            }
        },
        "html_url"
    );
    log::trace!("Executing query for repository entry {}", &full_name_field);
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
        Ok(res) => {
            log::trace!("Repository entry updated: {}", &full_name_field);
            Ok(())
        }
        Err(err) => {
            log::error!(
                "Error found while trying to update repository entry: {}",
                err
            );
            Err("Something went wrong while updting repository entry")
        }
    }
}

pub async fn update_issue_table_entry(
    db: &sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    issue: octocrab::models::issues::Issue,
) -> Result<(), &'static str> {
    log::trace!("Trying to update issue entry");

    let octocrab::models::issues::Issue {
        url,
        repository_url,
        title,
        body,
        state,
        number: r#number,
        html_url,
        created_at,
        updated_at,
        closed_at,
        user,
        labels,
        ..
    } = issue.clone();

    log::trace!("Preparing query fields");

    let url_field = trace_field!(url.to_string(), "url");
    let repository_url_field = trace_field!(repository_url.to_string(), "repository_url");
    let title_field = trace_field!(title, "title");
    let label_field = trace_field!(
        labels
            .into_iter()
            .map(|label| label.name)
            .collect::<Vec<String>>()
            .join(",")
            .as_str(),
        "issue_label"
    );
    let body_field = trace_field!(
        match body {
            Some(body) => body,
            None => {
                log::trace!("Using empty string since issue is missing \"body\"");
                String::default()
            }
        },
        "body"
    );
    let state_field = trace_field!(
        match state {
            octocrab::models::IssueState::Open => "open",
            octocrab::models::IssueState::Closed | _ => "closed",
        },
        "state"
    );
    let number_field = trace_field!(r#number.to_string(), "number");
    let html_url_field = trace_field!(html_url.to_string(), "html_url");
    let created_at_field = trace_datetime_field!(created_at.to_rfc3339(), "created_at");
    let updated_at_field = trace_datetime_field!(updated_at.to_rfc3339(), "updated_at");
    let closed_at_field = trace_datetime_field!(closed_at, "closed_at");
    let user_type_field = trace_field!(user.r#type, "user_type");

    log::trace!("Executing query for issue entry {}", &url_field);
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
        Ok(res) => {
            log::trace!("Issue entry updated: {}", &url_field,);
            Ok(())
        }
        Err(err) => {
            log::error!("Error found while trying to update issue entry: {}", err);
            Err("Something went wrong while updating issue entry")
        }
    }
}

pub async fn update_comment_table_entry(
    db: &sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    comment: octocrab::models::issues::Comment,
) -> Result<(), &'static str> {
    log::trace!("Trying to update comment entry");

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

    log::trace!("Preparing query fields");
    let url_field = trace_field!(url.to_string(), "url");
    let issue_url_field = trace_field!(
        match issue_url {
            Some(issue_url) => issue_url.to_string(),
            None => log_error_and_return!("issue_url"),
        },
        "issue_url"
    );
    let id_field = trace_field!(id.to_string(), "id");
    let body_field = trace_field!(
        match body {
            Some(body) => body,
            None => {
                log::trace!("Using empty string since comment is missing \"body\"");
                String::default()
            }
        },
        "body"
    );
    let html_url_field = trace_field!(html_url.to_string(), "html_url");
    let created_at_field = trace_datetime_field!(created_at, "created_at");
    let updated_at_field = trace_datetime_field!(updated_at, "updated_at");

    log::trace!("Executing query for comment entry {}", &url_field);
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
    .bind(&updated_at_field);

    match query.execute(db).await {
        Ok(res) => {
            log::trace!("Comment entry updated: {}", &url_field);
            Ok(())
        }
        Err(err) => {
            log::error!("Error found while trying to update comment entry: {}", err);
            Err("Something went wrong while updating comment entry")
        }
    }
}

#[tauri::command]
pub async fn update_db(
    handle: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
) -> Result<(), &'static str> {
    let db = &state.db;
    let crab = state.octocrab.clone();
    log::trace!("Trying to update database");

    log::trace!("Fetching available repositories from GitHub");
    let repos = crate::github::get::get_repositories(crab.clone()).await?;
    for repo in repos {
        log::trace!("Updating repository table entry for {}", &repo.url.as_str());
        update_repository_table_entry(db, crab.clone(), repo.clone()).await?;

        log::trace!("Fetching issues from GitHub");
        let issues = crate::github::get::get_issues(crab.clone(), repo.clone()).await?;
        for issue in issues.into_iter() {
            log::trace!("Updating issue table entry for {}", &issue.url.as_str());
            update_issue_table_entry(db, issue.clone()).await?;
        }

        log::trace!("Fetching comments from GitHub");
        let comments = crate::github::get::get_comments(crab.clone(), repo.clone()).await?;
        for comment in comments.into_iter() {
            log::trace!("Updating comment table entry for {}", &comment.url.as_str());
            update_comment_table_entry(db, comment.clone()).await?
        }
    }

    log::trace!("Getting user settings");
    let mut user_settings = crate::settings::get_app_settings(handle.clone())?;

    log::trace!("Updating user settings");
    user_settings.auto_update.last_updated = chrono::Utc::now().to_rfc3339();

    log::trace!("Serializing updated settings");
    let json_string = match serde_json::to_string_pretty(&user_settings) {
        Ok(json_string) => json_string,
        Err(err) => {
            log::error!(
                "Error found while trying to serialize updated user settings: {}",
                err
            );
            return Err("Something went wrong while serializing user settings");
        }
    };

    let path = crate::paths::get_setting_file(handle.clone())?;

    log::trace!("Writing updated settings to file");
    match std::fs::write(path, json_string) {
        Ok(()) => {
            log::trace!("Settings updated successfully");
            Ok(())
        }
        Err(err) => {
            log::error!(
                "Error found while trying to write updated user settings: {}",
                err
            );
            Err("Something went wrong while writing user settings")
        }
    }
}
