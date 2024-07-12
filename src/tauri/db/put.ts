import { invoke } from "@tauri-apps/api";

export const putRepositoryReadme = async (
	ownerName: string,
	repositoryName: string,
	content: string,
	commitMessage: string = "updated README.md via phosphophyllite",
): Promise<void> =>
	invoke("put_repository_readme", {
		ownerName,
		repositoryName,
		content,
		commitMessage,
	});
