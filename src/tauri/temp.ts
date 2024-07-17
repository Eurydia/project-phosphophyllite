import { invoke } from "@tauri-apps/api";

export const openInDefaultEditor = async (
	fileName: string,
	content: string,
): Promise<string> =>
	invoke("open_in_editor", {
		fileName,
		content,
	});
