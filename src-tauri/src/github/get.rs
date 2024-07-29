/// Extracts the owner and name from a repository.
fn get_repository_name_component(
    repository: octocrab::models::Repository,
) -> Result<(String, String), &'static str> {
    let octocrab::models::Repository { owner, name, .. } = repository;
    let octocrab::models::Author { login, .. } = match owner {
        Some(owner) => owner,
        None => return Err("Missing owner information"),
    };
    Ok((login, name))
}

/// Get all repositories accessible to the app installation.
///
/// [API Documentation](https://docs.github.com/en/rest/apps/installations?apiVersion=2022-11-28#list-repositories-accessible-to-the-app-installation)
pub async fn get_repositories(
    octocrab: octocrab::Octocrab,
) -> Result<Vec<octocrab::models::Repository>, &'static str> {
    log::trace!("Getting repositories from GitHub");
    let mut items: Vec<octocrab::models::Repository> = Vec::new();
    let mut page_number: i64 = 1;
    log::trace!("Fetching repositories");
    loop {
        log::trace!("Fetching page {}", &page_number);
        let octocrab::models::InstallationRepositories {
            repositories,
            total_count,
            ..
        } = match octocrab
            .get::<octocrab::models::InstallationRepositories, _, _>(
                format!("/installation/repositories?page={}", page_number),
                None::<&()>,
            )
            .await
        {
            Ok(installation_repositories) => installation_repositories,
            Err(err) => {
                log::error!("Error found while trying to get repositories: {}", err);
                return Err("Something went wrong while fetching repositories");
            }
        };

        log::trace!("Collecting repositories from respond");
        items.extend(repositories.into_iter());
        match i64::try_from(items.len()) {
            Ok(curr_size) => {
                if curr_size >= total_count {
                    break;
                }
                page_number += 1;
            }
            Err(err) => {
                log::error!("Error found while trying to convert size to i64: {}", err);
                return Err("Something went wrong while trying to parse repository size");
            }
        };
    }

    Ok(items)
}

/// Get encoded README content from a repository.
/// Returns an empty string if the repository does not have a README.
///
/// [API Documentation](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-a-repository-readme)
pub async fn get_repository_readme(
    octocrab: octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Result<String, &'static str> {
    let (owner_name, repository_name) = get_repository_name_component(repository)?;

    log::trace!(
        "Trying to get README in repository: {}/{}",
        &owner_name,
        &repository_name
    );

    let octocrab::models::repos::Content { content, .. } = match octocrab
        .repos(&owner_name, &repository_name)
        .get_readme()
        .send()
        .await
    {
        Ok(repo_content) => repo_content,
        Err(err) => match err {
            octocrab::Error::GitHub { source, .. } if source.status_code == 404 => {
                log::trace!(
                    "No README found in repository: {}/{}",
                    &owner_name,
                    &repository_name
                );
                return Ok(String::default());
            }
            _ => {
                log::error!("Error found while trying to fetch README: {}", err);
                return Err("Something went wrong while fetching README");
            }
        },
    };

    match content {
        Some(content) => Ok(content),
        None => Ok(String::default()),
    }
}

/// Get all issues from a repository.
///
/// [API Documentation](https://docs.github.com/en/rest/issues?apiVersion=2022-11-28#list-repository-issues)
pub async fn get_issues(
    octocrab: octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Result<Vec<octocrab::models::issues::Issue>, &'static str> {
    let (owner_name, repository_name) = get_repository_name_component(repository)?;

    log::trace!(
        "Trying to get issues in repository: {}/{}",
        &owner_name,
        &repository_name
    );

    let mut items: Vec<octocrab::models::issues::Issue> = Vec::new();
    let mut page_number = 1u32;
    log::trace!("Fetching issues");
    loop {
        log::trace!("Fetching page {}", &page_number);
        let respond = match octocrab
            .issues(&owner_name, &repository_name)
            .list()
            .state(octocrab::params::State::All)
            .page(page_number)
            .send()
            .await
        {
            Ok(respond) => respond,
            Err(err) => {
                log::error!("Error found while trying to fetch issues: {}", err);
                return Err("Someting went wrong while fetching issues");
            }
        };

        log::trace!("Collecting issues from respond");
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
    octocrab: octocrab::Octocrab,
    repository: octocrab::models::Repository,
) -> Result<Vec<octocrab::models::issues::Comment>, &'static str> {
    let (owner_name, repository_name) = get_repository_name_component(repository)?;

    log::trace!(
        "Trying to get comments in repository: {}/{}",
        &owner_name,
        &repository_name
    );

    let mut items: Vec<octocrab::models::issues::Comment> = Vec::new();
    let mut page_number = 1u32;
    log::trace!("Fetching comments");
    loop {
        log::trace!("Fetching page {}", &page_number);
        let respond = match octocrab
            .issues(&owner_name, &repository_name)
            .list_issue_comments()
            .page(page_number)
            .send()
            .await
        {
            Ok(respond) => respond,
            Err(err) => {
                log::error!("Error found while trying to fetch comments: {}", err);
                return Err("Something went wrong while fetching comments");
            }
        };

        log::trace!("Collecting comments from respond");
        items.extend(respond.items.into_iter());

        match respond.next {
            None => break,
            Some(_) => page_number += 1,
        }
    }

    Ok(items)
}
