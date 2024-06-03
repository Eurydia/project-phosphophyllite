import { invoke } from "@tauri-apps/api";
import {
	IssueQueryPref,
	RepoQueryPref,
} from "~types/query";

export const getRepoQueryPreference =
	async (): Promise<RepoQueryPref> => {
		const fallback: RepoQueryPref = {
			status: "active",
			visibility: "all",
			sortBy: "fullName",
			sortOrder: "asc",
		};
		try {
			const jsonString: string = await invoke(
				"get_repo_query_preferences",
			);
			const jsonObj: Record<string, string> =
				JSON.parse(jsonString);
			const _q: Record<string, string> = {};
			for (const k in fallback) {
				const _k = k as keyof RepoQueryPref;
				_q[_k] = jsonObj[_k] || fallback[_k];
			}
			return _q as RepoQueryPref;
		} catch (err) {
			console.warn(err);
			return fallback;
		}
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
		const fallback: IssueQueryPref = {
			ownerType: "user",
			state: "open",
			sortBy: "title",
			sortOrder: "asc",
		};
		try {
			const jsonString: string = await invoke(
				"get_issue_query_preferences",
			);
			const jsonObj: Record<string, string> =
				JSON.parse(jsonString);
			const _q: Record<string, string> = {};
			for (const k in fallback) {
				const _k = k as keyof IssueQueryPref;
				_q[_k] = jsonObj[_k] || fallback[_k];
			}
			return _q as IssueQueryPref;
		} catch (err) {
			console.warn(err);
			return fallback;
		}
	};

export const setIssueQueryPreference = async (
	pref: IssueQueryPref,
) => {
	const jsonString = JSON.stringify(pref);
	await invoke("set_issue_query_preferences", {
		jsonString,
	});
};
