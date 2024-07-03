import { fs } from "@tauri-apps/api";
import { BaseDirectory } from "@tauri-apps/api/fs";
import { appConfigDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/shell";
import { UserSetting } from "~types/schema";

export const openSettingFile = async () => {
	const fileName = "settings.json";
	const fileExists = await fs.exists(fileName, {
		dir: BaseDirectory.AppConfig,
	});
	if (!fileExists) {
		const fallback: UserSetting = {
			autoUpdate: {
				enabled: true,
				minium_elasped_time_second: 24 * 60 * 60,
			},
			issue: {
				ownerType: "user",
				state: "open",
				sortBy: "updatedAt",
				sortOrder: "asc",
			},
			repository: {
				status: "all",
				visibility: "all",
				sortBy: "pushedAt",
				sortOrder: "asc",
			},
		};

		await fs.writeTextFile(
			fileName,
			JSON.stringify(fallback, null, 2),
			{
				dir: BaseDirectory.AppConfig,
			},
		);
	}
	open((await appConfigDir()) + fileName);
};
