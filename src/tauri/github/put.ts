import { invoke } from "@tauri-apps/api";

export const tauriPutRepositoryReadme = async (
	ownerName: string,
	repositoryName: string,
	unencodedContent: string,
	commitMessage: string = "updated README.md via phosphophyllite",
): Promise<void> =>
	invoke("put_repository_readme", {
		ownerName,
		repositoryName,
		unencodedContent,
		commitMessage,
	});
