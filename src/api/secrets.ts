import { fs } from "@tauri-apps/api";
import { BaseDirectory } from "@tauri-apps/api/fs";
import { appLocalDataDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/shell";
import { convertRSAPublicKey as convertPrivateToPublicKey } from "~core/encoding";

const getSecretFileContent = async (
	filename: string,
) => {
	const pathExists = await fs.exists("secrets", {
		dir: BaseDirectory.AppData,
	});
	if (!pathExists) {
		await fs.createDir("secrets", {
			recursive: true,
			dir: BaseDirectory.AppData,
		});
	}

	const fileExists = await fs.exists(
		"secrets/" + filename,
		{
			dir: BaseDirectory.AppData,
		},
	);
	if (!fileExists) {
		await fs.writeTextFile(
			"secrets/" + filename,
			"",
			{
				dir: BaseDirectory.AppData,
			},
		);
	}
	return await fs.readTextFile(
		"secrets/" + filename,
		{
			dir: BaseDirectory.AppData,
		},
	);
};

export const getAppID = async () =>
	getSecretFileContent("APP_ID.txt");

export const getInstallationID = async () =>
	getSecretFileContent("INSTALLATION_ID.txt");

export const getPublicKey = async () => {
	const privateKey = await getSecretFileContent(
		"PRIVATE_KEY.pem",
	);
	return convertPrivateToPublicKey(privateKey);
};

export const openSecretsDir = async () => {
	const dirName = "secrets/";
	const pathExists = await fs.exists(dirName, {
		dir: BaseDirectory.AppData,
	});
	if (!pathExists) {
		await fs.createDir(dirName, {
			recursive: true,
			dir: BaseDirectory.AppData,
		});
	}
	open((await appLocalDataDir()) + dirName);
};
