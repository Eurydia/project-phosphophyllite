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
): Promise<AppRepository | null> =>
	invoke("get_repository_with_full_name", {
		fullName,
	});

export const getIssues = async (): Promise<
	AppIssue[]
> => invoke("get_issues");

export const getIssuesInRepository = async (
	repositoryUrl: string,
): Promise<AppIssue[]> =>
	invoke("get_issues_in_repository", {
		repositoryUrl,
	});

export const getIssueInRepositoryWithNumber =
	async (
		repositoryUrl: string,
		number: string,
	): Promise<AppIssue | null> =>
		invoke(
			"get_issue_in_repository_with_number",
			{
				repositoryUrl,
				number,
			},
		);

export const getCommentsInIssue = async (
	issueUrl: string,
): Promise<AppComment[]> =>
	invoke("get_comments_in_issue", {
		issueUrl,
	});
