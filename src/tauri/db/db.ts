import { invoke } from "@tauri-apps/api";

export const forceUpdateDB = async () =>
	invoke("update_db");

export const shouldUpdateDB =
	async (): Promise<boolean> =>
		invoke("should_update_db");
