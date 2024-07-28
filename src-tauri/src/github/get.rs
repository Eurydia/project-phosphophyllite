fn get_repository_name_component(
    repository: octocrab::models::Repository,
) -> Result<(String, String), String> {
    let octocrab::models::Repository { owner, name, .. } = repository;
    let octocrab::models::Author { login, .. } = owner.ok_or("Missing owner information")?;

    Ok((login, name))
}

/// Get all repositories accessible to the app installation.
///
/// [API Documentation](https://docs.github.com/en/rest/apps/installations?apiVersion=2022-11-28#list-repositories-accessible-to-the-app-installation)
pub async fn get_repositories(
    octocrab: &octocrab::Octocrab,
) -> Result<Vec<octocrab::models::Repository>, String> {
    let mut items: Vec<octocrab::models::Repository> = Vec::new();
    let mut page_number: i64 = 1;
    loop {
        let octocrab::models::InstallationRepositories {
            repositories,
            total_count,
            ..
        } = octocrab
            .get::<octocrab::models::InstallationRepositories, _, _>(
                format!("/installation/repositories?page={}", page_number),
                None::<&()>,
            )
            .await
            .map_err(|err| match err {
                octocrab::Error::GitHub { source, .. } => source.message,
                _ => err.to_string(),
            })?;

        items.extend(repositories.into_iter());
        let curr_size = i64::try_from(items.len()).map_err(|err| err.to_string())?;
        if curr_size >= total_count {
            break;
        }

        page_number += 1;
    }

    Ok(items)
}

/// Get encoded README content from a repository.
/// Returns an empty string if the repository does one.
///
/// [API Documentation](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-a-repository-readme)
pub async fn get_repository_readme(
    octocrab: &octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Result<String, String> {
    let (owner_name, repository_name) = get_repository_name_component(repository)?;

    let octocrab::models::repos::Content { content, .. } = octocrab
        .repos(owner_name, repository_name)
        .get_readme()
        .send()
        .await
        .map_err(|err| err.to_string())?;

    match content {
        Some(content) => Ok(content),
        None => Ok(String::new()),
    }
}

/// Get all issues from a repository.
///
/// [API Documentation](https://docs.github.com/en/rest/issues?apiVersion=2022-11-28#list-repository-issues)
pub async fn get_issues(
    octocrab: &octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Result<Vec<octocrab::models::issues::Issue>, String> {
    let (owner_name, repository_name) = get_repository_name_component(repository)?;

    let mut items: Vec<octocrab::models::issues::Issue> = Vec::new();
    let mut page_number = 1u32;
    loop {
        let respond = octocrab
            .issues(&owner_name, &repository_name)
            .list()
            .state(octocrab::params::State::All)
            .page(page_number)
            .send()
            .await
            .map_err(|err| err.to_string())?;

        items.extend(respond.items.into_iter());

        match respond.next {
            None => break,
            Some(_) => page_number += 1,
        }
    }

    Ok(items)
}

/// Get all comments from a repository.
///
/// [API Documentation](https://docs.github.com/en/rest/issues/comments?apiVersion=2022-11-28#list-issue-comments-for-a-repository)
pub async fn get_comments(
    octocrab: &octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Result<Vec<octocrab::models::issues::Comment>, String> {
    let (owner_name, repository_name) = get_repository_name_component(repository)?;

    let mut items: Vec<octocrab::models::issues::Comment> = Vec::new();
    let mut page_number = 1u32;

    loop {
        let respond = octocrab
            .issues(&owner_name, &repository_name)
            .list_issue_comments()
            .page(page_number)
            .send()
            .await
            .map_err(|err| err.to_string())?;

        items.extend(respond.items.into_iter());

        match respond.next {
            None => break,
            Some(_) => page_number += 1,
        }
    }

    Ok(items)
}
