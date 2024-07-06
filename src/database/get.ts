import { invoke } from "@tauri-apps/api";
import { Issue, Repository } from "~types/schema";

export const getRepositories = async (): Promise<
	Repository[]
> => invoke("get_repositories");

export const getRepositoryWithFullName = async (
	fullName: string,
): Promise<Repository> =>
	invoke("get_repository_with_full_name", {
		fullName,
	});

export const getIssues = async (): Promise<
	Issue[]
> => invoke("get_issues");

export const getIssuesInRepository = async (
	repoFullName: string,
): Promise<Issue[]> =>
	invoke("get_issue_in_repository", {
		repoFullName,
	});

export const getIssueInRepositoryWithNumber =
	async (
		repoFullName: string,
		number_: number,
	): Promise<Issue> =>
		invoke(
			"get_issue_in_repository_with_number",
			{
				repoFullName,
				number: number_,
			},
		);

export const getCachedComments = async (
	issueId: number,
): Promise<Issue> =>
	invoke("get_comments_in_issue", {
		issueId,
	});

// export const getRepoOptions = async () => {
// 	const repos = await getCachedRepos();
// 	const repoNames = repos
// 		.map((repo) => repo.fullName)
// 		.sort();
// 	const options: SelectOption<string>[] =
// 		repoNames.map((name) => ({
// 			label: name,
// 			value: name,
// 		}));
// 	return options;
// };
