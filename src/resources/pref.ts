import { invoke } from "@tauri-apps/api";
import { tryParse } from "~core/parsing";
import {
	IssueQueryPref,
	RepoQueryPref,
} from "~types/schema";

export const getPreference =
	async (): Promise<RepoQueryPref> => {
		const fallback: RepoQueryPref = {
			status: "active",
			visibility: "all",
			sortBy: "fullName",
			sortOrder: "asc",
		};
		const jsonString: string = await invoke(
			"get_preference",
		);
		const obj = tryParse(
			jsonString,
		) as RepoQueryPref | null;
		if (obj === null) {
			return fallback;
		}
		return obj;
	};

export const getPrefIssue =
	async (): Promise<IssueQueryPref> => {
		const fallback: IssueQueryPref = {
			ownerType: "user",
			state: "open",
			sortBy: "title",
			sortOrder: "asc",
		};
		const jsonString: string = await invoke(
			"get_preference",
		);
		const obj = tryParse(
			jsonString,
		) as IssueQueryPref | null;
		if (obj === null) {
			return fallback;
		}
		return obj;
	};
