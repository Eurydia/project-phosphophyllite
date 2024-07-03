use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct AppRepository {
    id: i64,
    name: String,
    full_name: String,
    visibility: String,
    archived: bool,
    pushed_at: String,
    created_at: String,
    updated_at: String,
    readme: String,
    html_url: String,
    description: String,
}

#[derive(FromRow, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppIssue {
    id: i64,
    repo_id: i64,
    repo_full_name: String,
    number: i64,
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
