use schemars::{schema_for, JsonSchema};
use serde::{Deserialize, Serialize};
use std::{io::Write, path::PathBuf};

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
struct RepositoryPreferenceStruct {
    status: Status,
    visibility: Visibility,
    sort_by: RepositorySortBy,
    sort_order: SortOrder,
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
struct IssuePreferenceStruct {
    owner_type: OwnerType,
    state: State,
    sort_by: IssueSortBy,
    sort_order: SortOrder,
}

#[derive(Serialize, Deserialize, JsonSchema)]
#[serde(rename_all = "camelCase")]
struct PreferenceStruct {
    #[serde(rename = "$schema")]
    schema: String,
    repository: RepositoryPreferenceStruct,
    issues: IssuePreferenceStruct,
}

impl Default for PreferenceStruct {
    fn default() -> Self {
        Self {
            schema: String::from("query_preferences.schema.json"),
            repository: RepositoryPreferenceStruct {
                status: Status::All,
                visibility: Visibility::All,
                sort_by: RepositorySortBy::FullName,
                sort_order: SortOrder::Asc,
            },
            issues: IssuePreferenceStruct {
                owner_type: OwnerType::User,
                state: State::Open,
                sort_by: IssueSortBy::Title,
                sort_order: SortOrder::Asc,
            },
        }
    }
}

pub fn resolve_preference_dir(handle: tauri::AppHandle) -> PathBuf {
    let path = handle
        .path_resolver()
        .app_config_dir()
        .unwrap()
        .join("config");
    let file = path.join("query_preferences.json");

    if !file.exists() {
        std::fs::create_dir_all(&path).unwrap();
        let pref = PreferenceStruct::default();
        let pref_string = serde_json::to_string_pretty(&pref).unwrap();
        std::fs::File::create(&file)
            .unwrap()
            .write_all(pref_string.as_bytes())
            .unwrap();
    }
    let schema = path.join("query_preferences.schema.json");
    let schema_string = serde_json::to_string(&schema_for!(PreferenceStruct)).unwrap();

    std::fs::File::create(schema)
        .unwrap()
        .write_all(schema_string.as_bytes())
        .unwrap();
    return file;
}

#[tauri::command]
pub fn get_preference(handle: tauri::AppHandle) -> String {
    let path = resolve_preference_dir(handle);
    let file_content = std::fs::read_to_string(path).unwrap();
    let json_string = serde_json::from_str(&file_content).unwrap();
    return json_string;
}
