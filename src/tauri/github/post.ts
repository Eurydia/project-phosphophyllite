import { invoke } from "@tauri-apps/api";

export const postIssue = async (
	ownerName: String,
	repositoryName: String,
	body: String,
) =>
	invoke("post_issue", {
		ownerName,
		repositoryName,
		body,
	});