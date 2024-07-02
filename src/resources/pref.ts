import { invoke } from "@tauri-apps/api";
import { tryParse } from "~core/parsing";
import {
	IssueQueryPref,
	RepoQueryPref,
} from "~types/schema";

export const getPreference =
	async (): Promise<RepoQueryPref> => {
		const jsonString: string = await invoke(
			"get_preference",
		);
		const obj = tryParse(jsonString) as {
			repository: RepoQueryPref;
		};
		return obj.repository;
	};

export const getPrefIssue =
	async (): Promise<IssueQueryPref> => {
		const jsonString: string = await invoke(
			"get_preference",
		);
		const obj = tryParse(jsonString) as {
			issue: IssueQueryPref;
		};
		return obj.issue;
	};
