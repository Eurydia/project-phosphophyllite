fn get_repository_name_component(repository: octocrab::models::Repository) -> (String, String) {
    let full_name = match repository.full_name {
        None => String::default(),
        Some(name) => name.to_string(),
    };
    let split = full_name.split("/").into_iter().collect::<Vec<&str>>();
    let owner_name = split
        .get(0)
        .map_or(String::default(), |name| name.to_string());
    let repository_name = split
        .get(1)
        .map_or(String::default(), |name| name.to_string());

    (owner_name, repository_name)
}

pub async fn get_repositories(octocrab: &octocrab::Octocrab) -> Vec<octocrab::models::Repository> {
    // https://docs.github.com/en/rest/apps/installations?apiVersion=2022-11-28#list-repositories-accessible-to-the-app-installation
    let mut items: Vec<octocrab::models::Repository> = Vec::new();
    let mut page_number = 1;
    loop {
        match octocrab
            .get(
                format!("/installation/repositories?page={}", page_number),
                None::<&()>,
            )
            .await
            as Result<octocrab::models::InstallationRepositories, octocrab::Error>
        {
            Err(_) => break,
            Ok(result) => {
                items.extend(result.repositories.into_iter());
                page_number += 1;
                match i64::try_from(items.len()) {
                    Err(_) => break,
                    Ok(len) => {
                        if len >= result.total_count {
                            break;
                        }
                    }
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
    let (owner_name, repository_name) = get_repository_name_component(repository);
    match octocrab
        .repos(owner_name, repository_name)
        .get_readme()
        .send()
        .await
    {
        Err(_) => String::default(),
        Ok(respond) => respond.content.unwrap_or(String::default()),
    }
}

pub async fn get_issues(
    octocrab: &octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Vec<octocrab::models::issues::Issue> {
    // https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
    let (owner_name, repository_name) = get_repository_name_component(repository);
    let mut items: Vec<octocrab::models::issues::Issue> = Vec::new();
    let mut page_number = 1u32;
    loop {
        let respond = octocrab
            .issues(&owner_name, &repository_name)
            .list()
            .page(page_number)
            .send()
            .await;
        match respond {
            Err(_) => break,
            Ok(mut result) => {
                items.extend(result.take_items());
                match result.next {
                    None => break,
                    Some(_) => page_number += 1,
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
    // https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#list-issue-comments-for-a-repository
    let (owner_name, repository_name) = get_repository_name_component(repository);
    let mut items: Vec<octocrab::models::issues::Comment> = Vec::new();
    let mut page_number = 1u32;
    loop {
        match octocrab
            .issues(&owner_name, &repository_name)
            .list_issue_comments()
            .page(page_number)
            .send()
            .await
        {
            Err(_) => break,
            Ok(mut respond) => {
                items.extend(respond.take_items());
                match respond.next {
                    None => break,
                    Some(_) => page_number += 1,
                }
            }
        }
    }
    items
}
