import { invoke } from "@tauri-apps/api";

export const tauriPostIssue = async (
	ownerName: String,
	repositoryName: String,
	body: String,
) =>
	invoke("post_issue", {
		ownerName,
		repositoryName,
		body,
	});

export const tauriPostComment = async (
	ownerName: String,
	repositoryName: String,
	issueNumber: Number,
	body: String,
) =>
	invoke("post_comment", {
		ownerName,
		repositoryName,
		issueNumber,
		body,
	});
