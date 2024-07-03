use futures::TryFutureExt;
use octocrab::{
    models::{
        issues::{Comment, Issue},
        webhook_events::payload::DeleteWebhookEventAction,
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

pub async fn get_repositories(octocrab: Octocrab) -> Vec<Repository> {
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
        items.extend(respond.repositories.into_iter());
        page += 1;
        if respond.total_count == items.len() as i64 {
            break;
        }
    }
    items
}

pub async fn get_repository_readme(octocrab: Octocrab, repository: Repository) -> String {
    match octocrab
        .repos(repository.owner.unwrap().login, repository.name)
        .get_readme()
        .send()
        .await
    {
        Ok(readme) => readme.content.unwrap_or(String::default()),
        Err(_) => String::default(),
    }
}

pub async fn get_issues(octocrab: Octocrab, repository: Repository) -> Vec<Issue> {
    let crab = octocrab.clone();
    let items = crab
        .issues(repository.owner.unwrap().login, repository.name)
        .list()
        .send()
        .await
        .unwrap()
        .into_iter()
        .collect::<Vec<Issue>>();
    items
}

pub async fn get_comments_all(octocrab: Octocrab, repository: Repository) -> Vec<Comment> {
    let crab = octocrab.clone();
    let items = crab
        .issues(repository.owner.unwrap().login, repository.name)
        .list_issue_comments()
        .send()
        .await
        .unwrap()
        .into_iter()
        .collect::<Vec<Comment>>();
    items
}
