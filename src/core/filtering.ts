import { matchSorter } from "match-sorter";
import {
	IssueQuery,
	RepoQuery,
} from "~types/query";
import {
	IssueSchema,
	RepoSchema,
} from "~types/schema";

export const filterRepos = (
	repos: RepoSchema[],
	query: RepoQuery,
) => {
	const { fullName, visibility, status } = query;
	const filterFns: ((
		item: RepoSchema,
	) => boolean)[] = [];
	if (visibility !== "all") {
		filterFns.push(
			(item) => item.visibility === visibility,
		);
	}
	if (status !== "all") {
		filterFns.push(
			(item) => item.status === status,
		);
	}
	let items = repos;
	if (filterFns.length > 0) {
		items = repos.filter((repo) =>
			filterFns.every((fn) => fn(repo)),
		);
	}
	const filteredItems = matchSorter(
		items,
		fullName,
		{
			keys: ["fullName"],
		},
	);
	return filteredItems;
};

export const filterIssues = (
	issues: IssueSchema[],
	query: IssueQuery,
) => {
	const { title, ownerType, state } = query;
	const filterFns: ((
		item: IssueSchema,
	) => boolean)[] = [];

	if (ownerType !== "all") {
		filterFns.push(
			(item) =>
				item.ownerType !== null &&
				item.ownerType === ownerType,
		);
	}
	if (state !== "all") {
		filterFns.push(
			(item) =>
				item.state === state.toLowerCase(),
		);
	}
	const items = issues.filter((item) =>
		filterFns.every((fn) => fn(item)),
	);
	const filteredItems = matchSorter(
		items,
		title,
		{
			keys: ["title"],
		},
	);
	return filteredItems;
};
