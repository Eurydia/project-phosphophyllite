import { invoke } from "@tauri-apps/api";

export const getInstallationId =
	async (): Promise<string> => {
		return await invoke(
			"get_secret_installation_id",
		);
	};
export const getAppId =
	async (): Promise<string> => {
		return await invoke("get_secret_app_id");
	};
export const getPrivateKey =
	async (): Promise<string> => {
		return await invoke("get_secret_private_key");
	};
