fn get_repository_name_component(
    repository: octocrab::models::Repository,
) -> Result<(String, String), String> {
    let owner_name = repository.owner.ok_or("Malformed repository data")?.login;
    let repository_name = repository.name;
    Ok((owner_name, repository_name))
}

pub async fn get_repositories(
    octocrab: &octocrab::Octocrab,
) -> Result<Vec<octocrab::models::Repository>, String> {
    // https://docs.github.com/en/rest/apps/installations?apiVersion=2022-11-28#list-repositories-accessible-to-the-app-installation
    let mut items: Vec<octocrab::models::Repository> = Vec::new();
    let mut page_number = 1;
    loop {
        let response = octocrab
            .get::<octocrab::models::InstallationRepositories, _, _>(
                format!("/installation/repositories?page={}", page_number),
                None::<&()>,
            )
            .await
            .map_err(|err| err.to_string())?;

        items.extend(response.repositories.into_iter());
        page_number += 1;
        match i64::try_from(items.len()) {
            Err(err) => return Err(err.to_string()),
            Ok(curr_len) => {
                if curr_len >= response.total_count {
                    break;
                }
            }
        };
    }
    Ok(items)
}

pub async fn get_repository_readme(
    octocrab: &octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Result<String, String> {
    // https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-a-repository-readme
    let (owner_name, repository_name) = get_repository_name_component(repository)?;

    let respond = octocrab
        .repos(owner_name, repository_name)
        .get_readme()
        .send()
        .await;

    match respond {
        Ok(respond) => respond.content.ok_or(String::default()),
        Err(err) => match err {
            octocrab::Error::GitHub {
                source: octocrab::GitHubError { status_code, .. },
                ..
            } => {
                if status_code == 404 {
                    Ok(String::default())
                } else {
                    Err(err.to_string())
                }
            }
            _ => Err(err.to_string()),
        },
    }
}

pub async fn get_issues(
    octocrab: &octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Result<Vec<octocrab::models::issues::Issue>, String> {
    // https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
    let (owner_name, repository_name) = get_repository_name_component(repository)?;
    let mut items: Vec<octocrab::models::issues::Issue> = Vec::new();
    let mut page_number = 1u32;
    loop {
        let mut respond = octocrab
            .issues(&owner_name, &repository_name)
            .list()
            .page(page_number)
            .send()
            .await
            .map_err(|err| err.to_string())?;

        items.extend(respond.take_items());
        match respond.next {
            None => break,
            Some(_) => page_number += 1,
        }
    }
    Ok(items)
}

pub async fn get_comments(
    octocrab: &octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Result<Vec<octocrab::models::issues::Comment>, String> {
    // https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#list-issue-comments-for-a-repository
    let (owner_name, repository_name) = get_repository_name_component(repository)?;
    let mut items: Vec<octocrab::models::issues::Comment> = Vec::new();
    let mut page_number = 1u32;
    loop {
        let mut respond = octocrab
            .issues(&owner_name, &repository_name)
            .list_issue_comments()
            .page(page_number)
            .send()
            .await
            .map_err(|err| err.to_string())?;

        items.extend(respond.take_items());
        match respond.next {
            None => break,
            Some(_) => page_number += 1,
        }
    }
    Ok(items)
}
