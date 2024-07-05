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
    issue_number: i64,
    title: String,
    state: String,
    created_at: String,
    updated_at: String,
    closed_at: String,
    html_url: String,
    repository_url: String,
    body: String,
}

#[derive(FromRow, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppComment {
    id: i64,
    body: String,
    created_at: String,
    updated_at: String,
    issue_url: String,
    html_url: String,
}
