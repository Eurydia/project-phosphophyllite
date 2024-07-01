use schemars::{schema_for, JsonSchema};
use serde::{Deserialize, Serialize};
use std::{io::Write, path::PathBuf};

const FILE_NAME: &str = "query_preferences.json";
const SCHEMA_NAME: &str = "query_preferences.schema.json";

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
enum Status {
    All,
    Active,
    Archived,
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
enum Visibility {
    All,
    Public,
    Private,
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
enum OwnerType {
    All,
    Bot,
    User,
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
enum SortOrder {
    Asc,
    Desc,
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
enum State {
    All,
    Open,
    Closed,
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
enum RepositorySortBy {
    FullName,
    CreatedAt,
    UpdatedAt,
    PushedAt,
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
enum IssueSortBy {
    Title,
    CreatedAt,
    UpdatedAt,
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
struct RepositoryQueryPreference {
    status: Status,
    visibility: Visibility,
    sort_by: RepositorySortBy,
    sort_order: SortOrder,
}

impl Default for RepositoryQueryPreference {
    fn default() -> Self {
        Self {
            status: Status::All,
            visibility: Visibility::All,
            sort_by: RepositorySortBy::FullName,
            sort_order: SortOrder::Asc,
        }
    }
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
struct IssueQueryPreference {
    owner_type: OwnerType,
    state: State,
    sort_by: IssueSortBy,
    sort_order: SortOrder,
}

impl Default for IssueQueryPreference {
    fn default() -> Self {
        Self {
            owner_type: OwnerType::User,
            state: State::Open,
            sort_by: IssueSortBy::Title,
            sort_order: SortOrder::Asc,
        }
    }
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
struct AutoUpdateSetting {
    enabled: bool,
    minium_elasped_time_second: u64,
}

impl Default for AutoUpdateSetting {
    fn default() -> Self {
        Self {
            enabled: true,
            minium_elasped_time_second: 24 * 60 * 60,
        }
    }
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
struct UserSetting {
    #[serde(rename = "$schema")]
    schema: String,
    repository: RepositoryQueryPreference,
    issues: IssueQueryPreference,
    auto_update: AutoUpdateSetting,
}

impl Default for UserSetting {
    fn default() -> Self {
        Self {
            schema: String::from(SCHEMA_NAME),
            repository: RepositoryQueryPreference::default(),
            issues: IssueQueryPreference::default(),
            auto_update: AutoUpdateSetting::default(),
        }
    }
}

pub fn resolve_preference_file_path(handle: tauri::AppHandle) -> PathBuf {
    let path = handle
        .path_resolver()
        .app_config_dir()
        .unwrap()
        .join("config");
    let file_path = path.join(FILE_NAME);

    // Generate the directory and the schema file if needed.
    // The content of schema file is hard-coded for now.
    // In the future, I will setup an API endpoint for it.
    if !path.exists() {
        std::fs::create_dir_all(&path).unwrap();
        let schema = path.join(SCHEMA_NAME);
        let schema_string = serde_json::to_string(&schema_for!(UserSetting)).unwrap();
        std::fs::File::create(schema)
            .unwrap()
            .write_all(schema_string.as_bytes())
            .unwrap();
    }

    if !file_path.exists() {
        let preference_string = serde_json::to_string_pretty(&UserSetting::default()).unwrap();
        let mut file = std::fs::File::create(&file_path).unwrap();
        file.write_all(preference_string.as_bytes()).unwrap();
    }

    return file_path;
}

#[tauri::command]
pub fn get_preference(handle: tauri::AppHandle) -> String {
    let path = resolve_preference_file_path(handle);
    let json_string = std::fs::read_to_string(&path).unwrap();

    // When deserialization fails, resets the preference file
    let preference_obj: UserSetting = serde_json::from_str(&json_string).unwrap_or_else(|err| {
        eprintln!("Bad value during deserialization. {}", err.to_string());
        let default_preference_string =
            serde_json::to_string_pretty(&UserSetting::default()).unwrap();
        let mut file = std::fs::File::create(&path).unwrap();
        file.write_all(default_preference_string.as_bytes())
            .unwrap();
        return UserSetting::default();
    });
    let preference_string = serde_json::to_string_pretty(&preference_obj).unwrap();

    return preference_string;
}
