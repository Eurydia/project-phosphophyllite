// import { fs } from "@tauri-apps/api";
// import { BaseDirectory } from "@tauri-apps/api/fs";
// import { tryParse } from "~core/parsing";
// import { GenericAppData } from "~types/schema";

// export const getDataMisc =
// 	async (): Promise<GenericAppData> => {
// 		const fallback: GenericAppData = {
// 			commentDataLastUpdate: null,
// 			issueDataLastUpdate: null,
// 			repoDataLastUpdate: null,
// 		};
// 		const fileExists = await fs.exists(
// 			"misc.json",
// 			{
// 				dir: BaseDirectory.AppData,
// 			},
// 		);
// 		if (!fileExists) {
// 			await fs.writeTextFile(
// 				"misc.json",
// 				JSON.stringify(fallback),
// 				{
// 					dir: BaseDirectory.AppData,
// 				},
// 			);
// 			return fallback;
// 		}
// 		const jsonString: string =
// 			await fs.readTextFile("misc.json", {
// 				dir: BaseDirectory.AppData,
// 			});
// 		const jsonObj = tryParse(jsonString);
// 		const pObj =
// 			APP_DATA_SCHEMA.safeParse(jsonObj);
// 		if (!pObj.success) {
// 			await fs.writeTextFile(
// 				"misc.json",
// 				JSON.stringify(fallback),
// 				{
// 					dir: BaseDirectory.AppData,
// 				},
// 			);
// 			return fallback;
// 		}
// 		return pObj.data;
// 	};

// export const setDataMisc = async (
// 	appData: GenericAppData,
// ) =>
// 	fs.writeTextFile(
// 		"misc.json",
// 		JSON.stringify(appData),
// 		{
// 			dir: BaseDirectory.AppData,
// 		},
// 	);
