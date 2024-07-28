import { invoke } from "@tauri-apps/api";

export const openSecretDir = async () =>
	invoke("open_secret_dir");

export const openLogDir = async () =>
	invoke("open_log_dir");

export const openSettingFile = async () =>
	invoke("open_setting_file");

export const openLink = async (href: string) =>
	invoke("open_href", { href });
