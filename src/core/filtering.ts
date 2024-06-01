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
	const { name, visibility, status } = query;
	const filterFns: ((
		item: RepoSchema,
	) => boolean)[] = [];
	if (visibility !== "All") {
		filterFns.push(
			(item) => item.visibility === visibility,
		);
	}
	if (status !== "All") {
		filterFns.push(
			(item) => item.status === status,
		);
	}
	const items = repos.filter((repo) =>
		filterFns.every((fn) => fn(repo)),
	);
	const filteredItems = matchSorter(items, name, {
		keys: ["fullName"],
	});
	return filteredItems;
};

export const filterIssues = (
	issues: IssueSchema[],
	query: IssueQuery,
) => {
	const {
		title,
		ownerType,
		repoFullNames,
		state,
	} = query;
	const filterFns: ((
		item: IssueSchema,
	) => boolean)[] = [];

	if (ownerType !== "All") {
		filterFns.push(
			(item) =>
				item.ownerType !== null &&
				item.ownerType === ownerType,
		);
	}
	if (repoFullNames.length > 0) {
		filterFns.push((item) =>
			repoFullNames.includes(item.repoFullName),
		);
	}
	if (state !== "All") {
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
