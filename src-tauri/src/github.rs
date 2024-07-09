use crate::secrets::{get_app_id, get_installation_id, get_rsa_private_key};

pub async fn get_octocrab(handle: tauri::AppHandle) -> octocrab::Octocrab {
    let app_id = get_app_id(&handle).parse::<u64>().unwrap();
    let rsa_private_key = get_rsa_private_key(&handle);
    let installation_id = get_installation_id(&handle).parse::<u64>().unwrap();

    let key = jsonwebtoken::EncodingKey::from_rsa_pem(rsa_private_key.as_bytes()).unwrap();

    octocrab::Octocrab::builder()
        .app(octocrab::models::AppId(app_id), key)
        .build()
        .unwrap()
        .installation(octocrab::models::InstallationId(installation_id))
}

pub async fn get_repositories(octocrab: &octocrab::Octocrab) -> Vec<octocrab::models::Repository> {
    let mut items: Vec<octocrab::models::Repository> = Vec::new();
    let mut page_number = 1;
    loop {
        // https://docs.github.com/en/rest/apps/installations?apiVersion=2022-11-28#list-repositories-accessible-to-the-app-installation
        let respond: Result<octocrab::models::InstallationRepositories, octocrab::Error> = octocrab
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

pub async fn get_repository_readme(
    octocrab: &octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> String {
    // https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-a-repository-readme
    let full_name = match repository.full_name {
        None => return String::default(),
        Some(name) => name,
    };
    octocrab
        .get(format!("/repos/{}/readme", full_name), None::<&()>)
        .await
        .map_or(String::default(), |dt: octocrab::models::repos::Content| {
            dt.content.unwrap_or(String::default())
        })
}

pub async fn get_issues(
    octocrab: &octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Vec<octocrab::models::issues::Issue> {
    let full_name = match repository.full_name {
        None => return Vec::new(),
        Some(name) => name,
    };
    let mut items: Vec<octocrab::models::issues::Issue> = Vec::new();
    let mut page_number = 1;
    loop {
        // https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
        let respond: Result<Vec<octocrab::models::issues::Issue>, octocrab::Error> = octocrab
            .get(
                format!("/repos/{}/issues?page={}&state=all", full_name, page_number),
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

pub async fn get_comments(
    octocrab: &octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Vec<octocrab::models::issues::Comment> {
    let full_name = match repository.full_name {
        None => return Vec::new(),
        Some(name) => name,
    };
    let mut items: Vec<octocrab::models::issues::Comment> = Vec::new();
    let mut page_number = 1u32;
    // https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#list-issue-comments-for-a-repository
    loop {
        let respond: Result<Vec<octocrab::models::issues::Comment>, octocrab::Error> = octocrab
            .get(
                format!("/repos/{}/issues/comments?page={}", full_name, page_number),
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
