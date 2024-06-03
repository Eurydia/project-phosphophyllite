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
): Promise<IssueQuery> => {
	const pref = await getIssueQueryPreference();
	const fallback: IssueQuery = {
		title: "",
		...pref,
	};
	const param = searchParamsToObj(searchParams);
	const _q: Record<string, string> = {};
	for (const [k, v] of Object.entries(fallback)) {
		_q[k] = param[k] || v;
	}
	return _q as IssueQuery;
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
