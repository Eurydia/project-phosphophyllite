import { invoke } from "@tauri-apps/api";

export const createTempFile = async (
	fileName: string,
	content: string,
): Promise<string> =>
	invoke("create_temp_file", {
		fileName,
		content,
	});

export const deleteTempFile = async (
	fileName: string,
): Promise<void> =>
	invoke("delete_temp_file", {
		fileName,
	});
