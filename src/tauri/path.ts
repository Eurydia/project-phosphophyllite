import { invoke } from "@tauri-apps/api";

export const openSecretDir = async () =>
	invoke("open_secret_path");

export const openConfigFile = async () =>
	invoke("open_setting_path");

export const openLink = async (href: string) =>
	invoke("open_href", { href });
