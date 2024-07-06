import { invoke } from "@tauri-apps/api";

export const signalOpenSecretDir = async () =>
	invoke("open_secret_path");

export const singalOpenSettingFile = async () =>
	invoke("open_setting_path");

export const singalOpenHref = async (
	href: string,
) => invoke("open_link", { href });
