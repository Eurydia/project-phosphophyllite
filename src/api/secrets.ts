import { fs } from "@tauri-apps/api";
import { BaseDirectory } from "@tauri-apps/api/fs";
import { appLocalDataDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/shell";

const getSecretFileContent = async (
	filename: string,
) => {
	const pathExists = await fs.exists("secrets", {
		dir: BaseDirectory.AppLocalData,
	});
	if (!pathExists) {
		await fs.createDir("secrets", {
			dir: BaseDirectory.AppLocalData,
		});
	}
	const filePath = "secrets/" + filename;
	const fileExists = await fs.exists(filePath, {
		dir: BaseDirectory.AppLocalData,
	});
	if (!fileExists) {
		await fs.writeTextFile(filePath, "", {
			dir: BaseDirectory.AppLocalData,
		});
	}

	return await fs.readTextFile(filePath, {
		dir: BaseDirectory.AppLocalData,
	});
};

export const getAppID = async () =>
	getSecretFileContent("APP_ID.txt");

export const getInstallationID = async () =>
	getSecretFileContent("INSTALLATION_ID.txt");

export const getPublicKey = async () =>
	getSecretFileContent("PRIVATE_KEY.txt");

export const openSecretsDir = async () => {
	const dirName = "secrets/";
	const pathExists = await fs.exists(dirName, {
		dir: BaseDirectory.AppLocalData,
	});
	if (!pathExists) {
		await fs.createDir(dirName, {
			recursive: true,
			dir: BaseDirectory.AppLocalData,
		});
	}
	open((await appLocalDataDir()) + dirName);
};
