import { invoke } from "@tauri-apps/api";
import { MiscData } from "~types/schema";

export const getDataMisc =
	async (): Promise<MiscData> => {
		const fallback: MiscData = {
			commentDataLastUpdate: undefined,
			issueDataLastUpdate: undefined,
			repoDataLastUpdate: undefined,
		};
		try {
			const jsonString: string = await invoke(
				"get_data_misc",
			);
			const jsonObj: Record<string, string> =
				JSON.parse(jsonString);
			const _q: Record<
				string,
				string | undefined
			> = {};
			for (const k in fallback) {
				const _k = k as keyof MiscData;
				_q[_k] = jsonObj[_k] || fallback[_k];
			}
			return _q as MiscData;
		} catch (err) {
			console.warn(err);
			return fallback;
		}
	};

export const setDataMisc = async (
	appData: MiscData,
) => {
	const jsonString = JSON.stringify(appData);
	await invoke("set_data_misc", {
		jsonString,
	});
};
