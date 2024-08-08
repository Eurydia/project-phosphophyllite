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

export const patchIssueTitle = async (
	ownerName: string,
	repositoryName: string,
	issueNumber: number,
	title: string,
): Promise<void> =>
	invoke("patch_issue_title", {
		ownerName,
		repositoryName,
		issueNumber,
		title,
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
