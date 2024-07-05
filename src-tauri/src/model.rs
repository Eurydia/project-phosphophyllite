use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
#[serde(rename_all = "camelCase")]
pub struct AppRepository {
    r#url: String,
    r#name: String,
    r#full_name: String,
    r#owner_login: String,
    r#pushed_at: String,
    r#created_at: String,
    r#updated_at: String,
    r#private: bool,
    r#archived: bool,
    r#visibility: String,
    r#html_url: String,
    r#description: String,
    r#readme: String,
}

#[derive(FromRow, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppIssue {
    r#url: String,
    r#repository_url: String,
    r#title: String,
    r#body: String,
    r#state: String,
    r#number: i64,
    r#html_url: String,
    r#created_at: String,
    r#updated_at: String,
    r#closed_at: String,
    r#user_type: String,
}

#[derive(FromRow, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppComment {
    r#url: String,
    r#issue_url: String,
    r#id: i64,
    r#body: String,
    r#html_url: String,
    r#created_at: String,
    r#updated_at: String,
}
