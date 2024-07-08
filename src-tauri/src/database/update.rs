macro_rules! unwrap_datetime {
    ($opt:expr) => {
        $opt.map_or(String::default(), |dt| dt.to_rfc3339())
    };
}

async fn update_repository_table_entry(
    db: &sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    crab: &octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Result<(), String> {
    let readme = crate::github::get_repository_readme(crab, repository.clone()).await;

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
    .unwrap();

    Ok(())
}

async fn update_issue_table_entry(
    db: &sqlx::pool::Pool<sqlx::sqlite::Sqlite>,
    issue: octocrab::models::issues::Issue,
) -> Result<(), String> {
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
                "user_type"
            )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
    .execute(db)
    .await
    .unwrap();

    Ok(())
}

async fn update_comment_table_entry(
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
    .bind(comment.url.as_str())
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
    .unwrap();

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
    let repos = crate::github::get_repositories(crab).await;
    for repo in repos.iter() {
        update_repository_table_entry(db, crab, repo.clone())
            .await
            .unwrap();

        let issues = crate::github::get_issues(crab, repo.clone()).await;
        for issue in issues.iter() {
            update_issue_table_entry(db, issue.clone()).await.unwrap();
        }

        let comments = crate::github::get_comments(crab, repo.clone()).await;
        for comment in comments.iter() {
            update_comment_table_entry(db, comment.clone())
                .await
                .unwrap()
        }
    }

    let path = handle
        .path_resolver()
        .app_config_dir()
        .unwrap()
        .join("settings.json");

    let mut settings = match path.try_exists() {
        Ok(true) => {
            let json_string = std::fs::read_to_string(&path).unwrap();
            serde_json::from_str(&json_string).unwrap_or(crate::models::AppData::default())
        }
        Err(_) | Ok(false) => {
            std::fs::File::create(&path).unwrap();
            crate::models::AppData::default()
        }
    };

    let dt_now = chrono::Utc::now();
    settings.auto_update.last_updated = dt_now.to_rfc3339();
    let json_string = serde_json::to_string(&settings).unwrap();
    std::fs::write(path, json_string).unwrap();
    Ok(())
}
