import { invoke } from "@tauri-apps/api";

export const patchRepositoryDescription = async (
	ownerName: string,
	repositoryName: string,
	description: string,
): Promise<void> =>
	invoke("patch_repository_description", {
		ownerName,
		repositoryName,
		description,
	});

export const patchIssue = async (
	ownerName: string,
	repositoryName: string,
	issueNumber: number,
	title: string,
	labels: string[],
	issueState: string,
): Promise<void> =>
	invoke("patch_issue", {
		ownerName,
		repositoryName,
		issueNumber,
		title,
		labels,
		issueState,
	});

export const patchIssueBody = async (
	ownerName: string,
	repositoryName: string,
	issueNumber: number,
	body: string,
): Promise<void> =>
	invoke("patch_issue_body", {
		ownerName,
		repositoryName,
		issueNumber,
		body,
	});
