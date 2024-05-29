use core::sync;
use std::io::Write;

use serde::Serialize;

#[derive(serde::Serialize, serde::Deserialize)]
pub struct RepoQueryPreference {
    status: String,
    visibility: String,
    topicMatchStrategy: String,
}

#[tauri::command]
pub fn get_repo_query_preferences(handle: tauri::AppHandle) -> RepoQueryPreference {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/settings/repo_query_preferences.json")
        .unwrap();
    let json_string = std::fs::read_to_string(&resource_path).unwrap();
    let data = serde_json::from_str(&json_string).unwrap();
    return data;
}

#[tauri::command]
pub fn set_repo_query_preferences(
    handle: tauri::AppHandle,
    status: String,
    visibility: String,
    topic_match_strategy: String,
) {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/settings/repo_query_preferences.json")
        .unwrap();

    let next = RepoQueryPreference {
        status,
        visibility,
        topicMatchStrategy: topic_match_strategy,
    };
    let json_string = serde_json::to_string(&next).unwrap();
    let mut file = std::fs::OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(&resource_path)
        .unwrap();
    file.write_all(json_string.as_bytes()).unwrap();
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct IssueQueryPreference {
    state: String,
    ownerType: String,
}

#[tauri::command]
pub fn get_issue_query_preferences(handle: tauri::AppHandle) -> IssueQueryPreference {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/settings/issue_query_preferences.json")
        .expect("failed to resolve resource");

    let json_string = std::fs::read_to_string(&resource_path).expect("cannot read file");
    let data = serde_json::from_str(json_string.as_str()).expect("bad format");
    return data;
}

#[tauri::command]
pub fn set_issue_query_preferences(handle: tauri::AppHandle, state: String, owner_type: String) {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/settings/issue_query_preferences.json")
        .unwrap();

    let next = IssueQueryPreference {
        ownerType: owner_type,
        state,
    };
    let json_string = serde_json::to_string(&next).unwrap();
    let mut file = std::fs::OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(&resource_path)
        .unwrap();
    file.write_all(json_string.as_bytes()).unwrap();
}

#[derive(serde::Serialize, serde::Deserialize)]
pub struct SyncData {
    repoLastSync: String,
    issueLastSync: String,
    commentLastSync: String,
}

#[tauri::command]
pub fn get_sync_data(handle: tauri::AppHandle) -> SyncData {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/settings/sync_data.json")
        .unwrap();
    let json_string = std::fs::read_to_string(&resource_path).unwrap();
    let data = serde_json::from_str(json_string.as_str()).unwrap();
    return data;
}

#[tauri::command]
pub fn set_sync_data(
    handle: tauri::AppHandle,
    repoLastSync: String,
    issueLastSync: String,
    commentLastSync: String,
) {
    let resource_path = handle
        .path_resolver()
        .resolve_resource("./resources/settings/sync_data.json")
        .unwrap();

    let next = SyncData {
        repoLastSync,
        issueLastSync,
        commentLastSync,
    };
    let json_string = serde_json::to_string(&next).unwrap();
    let mut file = std::fs::OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(&resource_path)
        .unwrap();
    file.write_all(json_string.as_bytes()).unwrap();
}
