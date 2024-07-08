use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
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
pub struct AppComment {
    r#url: String,
    r#issue_url: String,
    r#id: i64,
    r#body: String,
    r#html_url: String,
    r#created_at: String,
    r#updated_at: String,
}

#[derive(Serialize, Deserialize)]
pub struct AutoUpdateSettings {
    pub enabled: bool,
    pub minimum_elasped_interval_second: i64,
    pub last_updated: String,
}

impl Default for AutoUpdateSettings {
    fn default() -> Self {
        Self {
            enabled: false,
            minimum_elasped_interval_second: 24 * 60 * 60,
            last_updated: String::default(),
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct AppData {
    pub auto_update: AutoUpdateSettings,
}

impl Default for AppData {
    fn default() -> Self {
        Self {
            auto_update: AutoUpdateSettings::default(),
        }
    }
}
