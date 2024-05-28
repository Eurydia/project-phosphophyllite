import {
	URLSearchParamsInit,
	createSearchParams,
} from "react-router-dom";
import {
	getIssueFilterPrefOwnerType,
	getIssueFilterPrefState,
	getRepoFilterPrefTopicMatchStrategy,
	getRepoFilterPrefVisibility,
	getRepoQueryStatus,
} from "~database/preferences";
import { SortRule } from "~types/generics";
import {
	IssueQuery,
	RepoQuery,
} from "~types/query";

export const sortItems = <T>(
	rule: string | null,
	sortRules: SortRule<T>[],
	items: T[],
) => {
	if (sortRules.length <= 0) {
		return;
	}
	let compareFn = sortRules[0].compareFn;
	if (!rule) {
		for (const sortRule of sortRules) {
			if (sortRule.value === rule) {
				compareFn = sortRule.compareFn;
				break;
			}
		}
	}
	items.sort(compareFn);
};

export const toSearchParam = (
	query: URLSearchParamsInit,
) => {
	return createSearchParams(query).toString();
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

export const extractIssueQuery = (
	searchParams: URLSearchParams,
): IssueQuery => {
	const title = searchParams.get("title") || "";
	const repoFullNames = extractQueryItems(
		searchParams.get("repoFullNames") || "",
	);
	const ownerType =
		(searchParams.get(
			"ownerType",
		) as IssueQuery["ownerType"]) ||
		getIssueFilterPrefOwnerType();
	const state =
		(searchParams.get(
			"state",
		) as IssueQuery["state"]) ||
		getIssueFilterPrefState();

	const query: IssueQuery = {
		title,
		state,
		ownerType,
		repoFullNames,
	};
	return query;
};

export const extractRepoQuery = (
	searchParams: URLSearchParams,
) => {
	const topics = extractQueryItems(
		searchParams.get("topics") || "",
	);

	const name = searchParams.get("name") || "";
	const status =
		(searchParams.get(
			"status",
		) as RepoQuery["status"]) ||
		getRepoQueryStatus();
	const visibility =
		(searchParams.get(
			"visibility",
		) as RepoQuery["visibility"]) ||
		getRepoFilterPrefVisibility();
	const topicMatchStrategy =
		(searchParams.get(
			"topicMatchStrategy",
		) as RepoQuery["topicMatchStrategy"]) ||
		getRepoFilterPrefTopicMatchStrategy();
	const query: RepoQuery = {
		topics,
		name,
		status,
		visibility,
		topicMatchStrategy,
	};
	return query;
};
