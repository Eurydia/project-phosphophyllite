/// Takes a repository and collects just the owner and name components.
///
/// # Errors
/// - [`octocrab`] repository is missing owner information
macro_rules! get_repository_name_component {
    ($repo:expr) => {{
        let octocrab::models::Repository { owner, name, .. } = $repo;
        let octocrab::models::Author { login, .. } = match owner {
            Some(owner) => owner,
            None => {
                log::error!("Repository is missing owner information");
                return Err("Missing owner information");
            }
        };
        (login, name)
    }};
}

/// Get all repositories accessible to the app installation.
///
/// [API Documentation](https://docs.github.com/en/rest/apps/installations?apiVersion=2022-11-28#list-repositories-accessible-to-the-app-installation)
///
/// # Errors
/// - [`octocrab`] cannot get repositories
/// - Rust cannot convert [`Vec::len()`] into i64
pub async fn get_repositories(
    octocrab: &octocrab::Octocrab,
) -> Result<Vec<octocrab::models::Repository>, &'static str> {
    let mut items: Vec<octocrab::models::Repository> = Vec::new();
    let mut page_number: i64 = 1;
    loop {
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
                log::error!("Octocrab cannot get repositories: \"{}\"", err);
                return Err("Cannot get repositories");
            }
        };

        items.extend(repositories.into_iter());
        match i64::try_from(items.len()) {
            Ok(curr_size) => {
                if curr_size >= total_count {
                    break;
                }
                page_number += 1;
            }
            Err(err) => {
                log::error!("Rust cannot convert u64 into i64: \"{}\"", err);
                return Err("Cannot parse number");
            }
        };
    }

    Ok(items)
}

/// Get encoded README content from a repository.
///
/// If the repository does not have a README, [`octocrab`] will return a `octocrab::Error::GitHub` with a status code of 404. I will make an exception with this error and return an empty string.
///
/// [API Documentation](https://docs.github.com/en/rest/repos/contents?apiVersion=2022-11-28#get-a-repository-readme)
///
/// # Error
/// - [`octocrab`] cannot get README
pub async fn get_repository_readme(
    octocrab: &octocrab::Octocrab,
    repository: &octocrab::models::Repository,
) -> Result<String, &'static str> {
    let (owner_name, repository_name) = get_repository_name_component!(repository);

    let octocrab::models::repos::Content { content, .. } = match octocrab
        .repos(owner_name, repository_name)
        .get_readme()
        .send()
        .await
    {
        Ok(repo_content) => repo_content,
        Err(err) => match err {
            octocrab::Error::GitHub { source, .. } if source.status_code == 404 => {
                return Ok(String::default());
            }
            _ => {
                log::error!("Octoc`rab cannot get README: \"{}\"", err);
                return Err("Cannot get README");
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
///
/// # Errors
/// - [`octocrab`] cannot get issues
pub async fn get_issues(
    octocrab: &octocrab::Octocrab,
    repository: &octocrab::models::Repository,
) -> Result<Vec<octocrab::models::issues::Issue>, &'static str> {
    let (owner_name, repository_name) = get_repository_name_component!(repository);

    let mut items: Vec<octocrab::models::issues::Issue> = Vec::new();
    let mut page_number = 1u32;
    loop {
        let respond = match octocrab
            .issues(owner_name, repository_name)
            .list()
            .state(octocrab::params::State::All)
            .page(page_number)
            .send()
            .await
        {
            Ok(respond) => respond,
            Err(err) => {
                log::error!("Octocrab cannot get issues: \"{}\"", err);
                return Err("Cannot get issues");
            }
        };

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
///
/// # Errors
/// - [`octocrab`] cannot get comments
pub async fn get_comments(
    octocrab: &octocrab::Octocrab,
    repository: &octocrab::models::Repository,
) -> Result<Vec<octocrab::models::issues::Comment>, &'static str> {
    let (owner_name, repository_name) = get_repository_name_component!(repository);

    let mut items: Vec<octocrab::models::issues::Comment> = Vec::new();
    let mut page_number = 1u32;
    loop {
        let respond = match octocrab
            .issues(owner_name, repository_name)
            .list_issue_comments()
            .page(page_number)
            .send()
            .await
        {
            Ok(respond) => respond,
            Err(err) => {
                log::error!("Octocrab canot get comments: \"{}\"", err);
                return Err("Cannot get comments");
            }
        };

        items.extend(respond.items.into_iter());

        match respond.next {
            None => break,
            Some(_) => page_number += 1,
        }
    }

    Ok(items)
}
