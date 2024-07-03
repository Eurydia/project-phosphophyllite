import { matchSorter } from "match-sorter";
import {
	Issue,
	IssueQuery,
	RepoQuery,
	Repository,
} from "~types/schema";

export const filterRepos = (
	repos: Repository[],
	query: RepoQuery,
) => {
	const { fullName, visibility, status } = query;
	const filterFns: ((
		item: Repository,
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
	issues: Issue[],
	query: IssueQuery,
) => {
	const { title, ownerType, state } = query;
	const filterFns: ((item: Issue) => boolean)[] =
		[];

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
			keys: ["title", "repoFullName"],
		},
	);
	return filteredItems;
};
