import { invoke } from "@tauri-apps/api";
import {
	IssueQueryPref,
	RepoQueryPref,
} from "~types/query";

export const getRepoQueryPreference =
	async () => {
		const pref = (await invoke(
			"get_repo_query_preferences",
		)) as RepoQueryPref;
		return pref;
	};

export const setRepoQueryPreference = async (
	pref: RepoQueryPref,
) => {
	await invoke(
		"set_repo_query_preferences",
		pref,
	);
};

export const getIssueQueryPreference =
	async () => {
		const pref = (await invoke(
			"get_issue_query_preferences",
		)) as IssueQueryPref;
		return pref;
	};

export const setIssueQueryPreference = async (
	pref: IssueQueryPref,
) => {
	await invoke(
		"set_issue_query_preferences",
		pref,
	);
};
