import { invoke } from "@tauri-apps/api";
import { jsonParseDefault } from "~core/json";
import {
	IssueQueryPref,
	RepoQueryPref,
} from "~types/query";

export const getRepoQueryPreference =
	async (): Promise<RepoQueryPref> => {
		const jsonString: string = await invoke(
			"get_repo_query_preferences",
		);
		const fallback: RepoQueryPref = {
			status: "Active",
			visibility: "All",
		};
		const query = jsonParseDefault(
			jsonString,
			fallback,
		);
		return query;
	};

export const setRepoQueryPreference = async (
	pref: RepoQueryPref,
) => {
	const jsonString = JSON.stringify(pref);
	await invoke("set_repo_query_preferences", {
		jsonString,
	});
};

export const getIssueQueryPreference =
	async (): Promise<IssueQueryPref> => {
		const jsonString: string = await invoke(
			"get_issue_query_preferences",
		);
		const fallback: IssueQueryPref = {
			ownerType: "User",
			state: "Open",
		};
		const query: IssueQueryPref =
			jsonParseDefault(jsonString, fallback);
		return query;
	};

export const setIssueQueryPreference = async (
	pref: IssueQueryPref,
) => {
	const jsonString = JSON.stringify(pref);
	await invoke("set_issue_query_preferences", {
		jsonString,
	});
};
