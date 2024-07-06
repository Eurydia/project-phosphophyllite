use octocrab::{
    models::{
        issues::{Comment, Issue},
        AppId, InstallationId, InstallationRepositories, Repository,
    },
    Octocrab,
};

use crate::secrets::{get_app_id, get_installation_id, get_rsa_private_key};

pub async fn get_octocrab(handle: tauri::AppHandle) -> Octocrab {
    let app_id = get_app_id(&handle).parse::<u64>().unwrap();
    let rsa_private_key = get_rsa_private_key(&handle);
    let installation_id = get_installation_id(&handle).parse::<u64>().unwrap();

    let key = jsonwebtoken::EncodingKey::from_rsa_pem(rsa_private_key.as_bytes()).unwrap();

    Octocrab::builder()
        .app(AppId(app_id), key)
        .build()
        .unwrap()
        .installation(InstallationId(installation_id))
}

pub async fn get_repositories(octocrab: &Octocrab) -> Vec<Repository> {
    let mut items: Vec<Repository> = Vec::new();
    let mut page_number = 1;
    loop {
        // https://docs.github.com/en/rest/apps/installations?apiVersion=2022-11-28#list-repositories-accessible-to-the-app-installation
        let respond: Result<InstallationRepositories, octocrab::Error> = octocrab
            .get(
                format!("/installation/repositories?page={}", page_number),
                None::<&()>,
            )
            .await;
        match respond {
            Err(_) => break,
            Ok(result) => {
                items.extend(result.repositories.into_iter());
                page_number += 1;
                if i64::try_from(items.len()).unwrap_or(result.total_count) == result.total_count {
                    break;
                }
            }
        }
    }
    items
}

pub async fn get_repository_readme(octocrab: &Octocrab, repository: Repository) -> String {
    // https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-a-repository-readme
    octocrab
        .get(
            format!(
                "/repos/{}/readme",
                repository.full_name.unwrap_or(String::from("!/!")),
            ),
            None::<&()>,
        )
        .await
        .map_or(String::default(), |dt: octocrab::models::repos::Content| {
            dt.content.unwrap_or(String::default())
        })
}

pub async fn get_issues(octocrab: &Octocrab, repository: Repository) -> Vec<Issue> {
    let mut items: Vec<Issue> = Vec::new();
    let mut page_number = 1;
    loop {
        // https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
        let respond: Result<Vec<Issue>, octocrab::Error> = octocrab
            .get(
                format!(
                    "/repos/{}/issues?page={}",
                    repository.clone().full_name.unwrap_or(String::from("!/!")),
                    page_number
                ),
                None::<&()>,
            )
            .await;
        match respond {
            Err(_) => break,
            Ok(result) => {
                items.extend(result.clone());
                page_number += 1;
                if result.len() == 0 {
                    break;
                }
            }
        }
    }
    items
}

pub async fn get_comments(octocrab: &Octocrab, repository: Repository) -> Vec<Comment> {
    let mut items: Vec<Comment> = Vec::new();
    let mut page_number = 1u32;
    // https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#list-issue-comments-for-a-repository
    loop {
        let resp: Result<Vec<Comment>, octocrab::Error> = octocrab
            .get(
                format!(
                    "/repos/{}/issues/comments?page={}",
                    repository.clone().full_name.unwrap_or(String::from("!/!")),
                    page_number
                ),
                None::<&()>,
            )
            .await;
        match resp {
            Err(_) => break,
            Ok(result) => {
                items.extend(result.clone());
                page_number += 1;
                if result.len() == 0 {
                    break;
                }
            }
        }
    }
    items
}
