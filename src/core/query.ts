import {
	getIssueQueryPreference,
	getRepoQueryPreference,
} from "resources/settings";
import {
	IssueQuery,
	RepoQuery,
} from "~types/query";

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
) => {
	const pref = await getRepoQueryPreference();
	const topics = extractQueryItems(
		searchParams.get("topics") || "",
	);
	const name = searchParams.get("name") || "";
	const status =
		(searchParams.get(
			"status",
		) as RepoQuery["status"]) || pref.status;
	const visibility =
		(searchParams.get(
			"visibility",
		) as RepoQuery["visibility"]) ||
		pref.visibility;
	const topicMatchStrategy =
		(searchParams.get(
			"topicMatchStrategy",
		) as RepoQuery["topicMatchStrategy"]) ||
		pref.topicMatchStrategy;
	const query: RepoQuery = {
		topics,
		name,
		status,
		visibility,
		topicMatchStrategy,
	};
	return query;
};
