import { invoke } from "@tauri-apps/api";

export const patchRepositoryDescription = async (
	ownerName: string,
	repositoryName: string,
	description: string,
): Promise<void> =>
	invoke("patch_repository_description", {
		ownerName,
		repositoryName,
		// description,
	});
