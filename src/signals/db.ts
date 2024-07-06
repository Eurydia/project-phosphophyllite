import { invoke } from "@tauri-apps/api";

export const shouldUpdateDB =
	async (): Promise<boolean> =>
		invoke("should_update_db");

export const signalUpdateDB = async () =>
	invoke("update_db");
