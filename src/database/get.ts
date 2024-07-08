import { invoke } from "@tauri-apps/api";
import {
	AppComment,
	AppIssue,
	AppRepository,
} from "~types/models";

export const getRepositories = async (): Promise<
	AppRepository[]
> => invoke("get_repositories");

export const getRepositoryWithFullName = async (
	fullName: string,
): Promise<AppRepository> =>
	invoke("get_repository_with_full_name", {
		fullName,
	});

export const getIssues = async (): Promise<
	AppIssue[]
> => invoke("get_issues");

export const getIssuesInRepository = async (
	repoFullName: string,
): Promise<AppIssue[]> =>
	invoke("get_issue_in_repository", {
		repoFullName,
	});

export const getIssueInRepositoryWithNumber =
	async (
		repoFullName: string,
		number: number,
	): Promise<AppIssue> =>
		invoke(
			"get_issue_in_repository_with_number",
			{
				repoFullName,
				number,
			},
		);

export const getCachedComments = async (
	issueId: number,
): Promise<AppComment[]> =>
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
