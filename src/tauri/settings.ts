import { invoke } from "@tauri-apps/api";

export const revertAppSettings = async () =>
	invoke("revert_app_settings");
