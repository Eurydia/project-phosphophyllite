use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct AppRepository {
    pub r#url: String,
    pub r#name: String,
    pub r#full_name: String,
    pub r#owner_login: String,
    pub r#pushed_at: String,
    pub r#created_at: String,
    pub r#updated_at: String,
    pub r#private: bool,
    pub r#archived: bool,
    pub r#visibility: String,
    pub r#html_url: String,
    pub r#description: String,
    pub r#readme: String,
}

#[derive(FromRow, Serialize, Deserialize)]
pub struct AppIssue {
    pub r#url: String,
    pub r#repository_url: String,
    pub r#title: String,
    pub r#body: String,
    pub r#state: String,
    pub r#number: i64,
    pub r#html_url: String,
    pub r#created_at: String,
    pub r#updated_at: String,
    pub r#closed_at: String,
    pub r#user_type: String,
    pub r#issue_label: String,
}

#[derive(FromRow, Serialize, Deserialize)]
pub struct AppComment {
    pub r#url: String,
    pub r#issue_url: String,
    pub r#id: i64,
    pub r#body: String,
    pub r#html_url: String,
    pub r#created_at: String,
    pub r#updated_at: String,
}

#[derive(Serialize, Deserialize)]
pub struct AutoUpdateSettings {
    pub enabled: bool,
    pub minimum_elasped_interval_second: i64,
    pub last_updated: String,
}

#[derive(Serialize, Deserialize)]
pub struct UserSettings {
    pub index_bot_generated_issues: bool,
    pub custom_issue_label: Vec<String>,
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

impl Default for UserSettings {
    fn default() -> Self {
        Self {
            index_bot_generated_issues: false,
            custom_issue_label: Vec::new(),
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct AppSettings {
    pub auto_update: AutoUpdateSettings,
    pub user_config: UserSettings,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            auto_update: AutoUpdateSettings::default(),
            user_config: UserSettings::default(),
        }
    }
}
