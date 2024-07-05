// import { invoke } from "@tauri-apps/api";
// import { tryParse } from "~core/parsing";
// import {
// 	IssueQueryPreference,
// 	RepositoryQueryPreference,
// } from "~types/schema";

// export const getPrefRepo =
// 	async (): Promise<RepositoryQueryPreference> => {
// 		const jsonString: string = await invoke(
// 			"get_preference",
// 		);
// 		const obj = tryParse(jsonString) as {
// 			repository: RepositoryQueryPreference;
// 		};
// 		return obj.repository;
// 	};

// export const getPrefIssue =
// 	async (): Promise<IssueQueryPreference> => {
// 		const jsonString: string = await invoke(
// 			"get_preference",
// 		);
// 		const obj = tryParse(jsonString) as {
// 			issue: IssueQueryPreference;
// 		};
// 		return obj.issue;
// 	};
