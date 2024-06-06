import { invoke } from "@tauri-apps/api";

export const getInstallationId =
	async (): Promise<string> => {
		return await invoke("get_installation_id");
	};
export const getAppId =
	async (): Promise<string> => {
		return await invoke("get_app_id");
	};
export const getPrivateKey =
	async (): Promise<string> => {
		return await invoke("get_private_key");
	};
