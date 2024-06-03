import {
	getIssueQueryPreference,
	getRepoQueryPreference,
} from "resources/settings";
import {
	IssueQuery,
	RepoQuery,
} from "~types/query";

const searchParamsToObj = (
	searchParam: URLSearchParams,
): Record<string, string> => {
	const obj: Record<string, string> = {};
	for (const [k, v] of searchParam.entries()) {
		obj[k] = v;
	}
	return obj;
};

export const extractQueryItems = (
	query: string,
) => {
	const items = query
		.normalize()
		.trim()
		.split(",")
		.map((item) => item.trim())
		.filter((item) => item.length > 0);
	return items;
};

export const extractIssueQuery = async (
	searchParams: URLSearchParams,
) => {
	const pref = await getIssueQueryPreference();

	const title = searchParams.get("title") || "";
	const repoFullNames = extractQueryItems(
		searchParams.get("repoFullNames") || "",
	);
	const ownerType =
		(searchParams.get(
			"ownerType",
		) as IssueQuery["ownerType"]) ||
		pref.ownerType;
	const state =
		(searchParams.get(
			"state",
		) as IssueQuery["state"]) || pref.state;

	const query: IssueQuery = {
		title,
		state,
		ownerType,
		repoFullNames,
	};
	return query;
};

export const extractRepoQuery = async (
	searchParams: URLSearchParams,
): Promise<RepoQuery> => {
	const pref = await getRepoQueryPreference();
	const fallback: RepoQuery = {
		fullName: "",
		...pref,
	};
	const param = searchParamsToObj(searchParams);
	const _q: Record<string, string> = {};
	for (const [k, v] of Object.entries(fallback)) {
		_q[k] = param[k] || v;
	}
	return _q as RepoQuery;
};
