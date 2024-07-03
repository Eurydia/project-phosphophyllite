use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AppRepository {
    id: u64,
    name: String,
    full_name: String,
    visibility: String,
    archived: i8,
    pushed_at: String,
    created_at: String,
    updated_at: String,
    readme: String,
    html_url: String,
    description: String,
}

#[derive(sqlx::FromRow, Serialize, Deserialize)]
pub struct AppIssue {
    id: u64,
    repo_id: u64,
    repo_full_name: String,
    number: u64,
    title: String,
    state: String,
    owner_type: String,
    created_at: String,
    updated_at: String,
    closed_at: String,
    html_url: String,
    body: String,
}

#[derive(sqlx::FromRow, Serialize, Deserialize)]
pub struct AppComment {
    id: u64,
    issue_id: u64,
    html_url: String,
    body: String,
    created_at: String,
    updated_at: String,
}
