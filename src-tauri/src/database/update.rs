macro_rules! unwrap_datetime {
    ($opt:expr) => {
        $opt.map_or(String::default(), |dt| dt.to_rfc3339())
    };
}

pub async fn update_repository_table_entry(
    db: &sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    crab: &octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Result<(), String> {
    let readme = crate::github::get::get_repository_readme(crab, repository.clone()).await?;

    sqlx::query(
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
    .bind(repository.url.as_str())
    .bind(repository.name)
    .bind(repository.full_name.unwrap_or(String::default()))
    .bind(repository.owner.map_or(String::default(), |dt| dt.login))
    .bind(unwrap_datetime!(repository.pushed_at))
    .bind(unwrap_datetime!(repository.created_at))
    .bind(unwrap_datetime!(repository.updated_at))
    .bind(repository.private.unwrap_or(false))
    .bind(repository.archived.unwrap_or(false))
    .bind(repository.visibility.unwrap_or(String::default()))
    .bind(
        repository
            .html_url
            .map_or(String::default(), |dt| dt.to_string()),
    )
    .bind(repository.description.unwrap_or(String::default()))
    .bind(readme)
    .execute(db)
    .await
    .map_err(|err| err.to_string())?;

    Ok(())
}

pub async fn update_issue_table_entry(
    db: &sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    issue: octocrab::models::issues::Issue,
) -> Result<(), String> {
    let collected_labels = issue
        .labels
        .into_iter()
        .map(|label| label.name.clone())
        .collect::<Vec<String>>();
    let collected_label_string = collected_labels.join(",");

    sqlx::query(
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
    .bind(issue.url.as_str())
    .bind(issue.repository_url.as_str())
    .bind(issue.title)
    .bind(issue.body.unwrap_or(String::default()))
    .bind(match issue.state {
        octocrab::models::IssueState::Open => "open",
        octocrab::models::IssueState::Closed | _ => "closed",
    })
    .bind(issue.number.to_string())
    .bind(issue.html_url.as_str())
    .bind(issue.created_at.to_rfc3339())
    .bind(issue.updated_at.to_rfc3339())
    .bind(unwrap_datetime!(issue.closed_at))
    .bind(issue.user.r#type)
    .bind(&collected_label_string)
    .execute(db)
    .await
    .map_err(|err| err.to_string())?;

    Ok(())
}

pub async fn update_comment_table_entry(
    db: &sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    comment: octocrab::models::issues::Comment,
) -> Result<(), String> {
    sqlx::query(
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
    .bind(comment.url.to_string())
    .bind(
        comment
            .issue_url
            .map_or(String::default(), |dt| dt.to_string()),
    )
    .bind(comment.id.to_string())
    .bind(comment.body.unwrap_or(String::default()))
    .bind(comment.html_url.to_string())
    .bind(comment.created_at.to_rfc3339())
    .bind(unwrap_datetime!(comment.updated_at))
    .execute(db)
    .await
    .map_err(|err| err.to_string())?;

    Ok(())
}

#[tauri::command]
pub async fn update_db(
    handle: tauri::AppHandle,
    state: tauri::State<'_, crate::AppState>,
    _: tauri::Window,
) -> Result<(), String> {
    let crab = &state.octocrab;
    let db = &state.db;
    let repos = crate::github::get::get_repositories(crab).await?;
    for repo in repos {
        update_repository_table_entry(db, crab, repo.clone()).await?;

        let issues = crate::github::get::get_issues(crab, repo.clone()).await?;
        for issue in issues.into_iter() {
            update_issue_table_entry(db, issue.clone()).await?;
        }

        let comments = crate::github::get::get_comments(crab, repo.clone()).await?;
        for comment in comments.into_iter() {
            update_comment_table_entry(db, comment.clone()).await?
        }
    }

    let mut user_settings = crate::config::get_app_settings(&handle)?;
    user_settings.auto_update.last_updated = chrono::Utc::now().to_rfc3339();

    let json_string =
        serde_json::to_string_pretty(&user_settings).map_err(|err| err.to_string())?;

    let path = crate::paths::get_setting_file(&handle)?;

    std::fs::write(path, json_string).map_err(|err| err.to_string())
}
