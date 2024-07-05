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
    let mut page = 1;
    loop {
        let respond: InstallationRepositories = octocrab
            .get(
                format!("/installation/repositories?page={}", page),
                None::<&()>,
            )
            .await
            .unwrap();
        page += 1;
        if respond.total_count == items.len() as i64 {
            break;
        }
        items.extend(respond.repositories.into_iter());
    }
    items
}

pub async fn get_repository_readme(octocrab: &Octocrab, repository: Repository) -> String {
    octocrab
        .repos(
            repository.owner.map_or(String::default(), |dt| dt.login),
            repository.name,
        )
        .get_readme()
        .send()
        .await
        .map_or(String::default(), |dt| {
            dt.content.unwrap_or(String::default())
        })
}

pub async fn get_issues(octocrab: &Octocrab, repository: &Repository) -> Vec<Issue> {
    let mut items = Vec::new();
    let mut page = 1u32;
    loop {
        let resp = octocrab
            .issues(
                repository.owner.as_ref().unwrap().login.to_string(),
                repository.name.to_string(),
            )
            .list()
            .page(page)
            .send()
            .await
            .unwrap()
            .into_iter()
            .collect::<Vec<Issue>>();
        if resp.len() == 0 {
            break;
        }
        page += 1;
        items.extend(resp)
    }
    items
}

pub async fn get_comments(octocrab: &Octocrab, repository: &Repository) -> Vec<Comment> {
    let mut items = Vec::new();
    let mut page = 1u32;
    loop {
        let resp = octocrab
            .issues(
                repository.owner.as_ref().unwrap().login.to_string(),
                repository.name.to_string(),
            )
            .list_issue_comments()
            .page(page)
            .send()
            .await
            .unwrap()
            .into_iter()
            .collect::<Vec<Comment>>();
        if resp.len() == 0 {
            break;
        }
        page += 1;
        items.extend(resp)
    }
    items
}
