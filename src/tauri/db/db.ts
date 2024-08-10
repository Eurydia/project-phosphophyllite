import { invoke } from "@tauri-apps/api";

export const tauriUpdateDB =
	async (): Promise<void> => invoke("update_db");

export const tauriShouldUpdateDB =
	async (): Promise<boolean> =>
		invoke("should_update_db");
