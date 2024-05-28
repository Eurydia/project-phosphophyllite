import { matchSorter } from "match-sorter";
import {
	IssueQuery,
	RepoQuery,
} from "~types/query";
import {
	IssueSchema,
	RepoSchema,
} from "~types/schemas";

export const filterRepos = (
	repos: RepoSchema[],
	query: RepoQuery,
) => {
	const {
		name,
		topics,
		visibility,
		status,
		topicMatchStrategy,
	} = query;
	const filterFns: ((
		item: RepoSchema,
	) => boolean)[] = [];

	switch (visibility) {
		case "Private":
			filterFns.push((item) => item.is_private);
			break;
		case "Public":
			filterFns.push((item) => !item.is_private);
			break;
	}
	switch (status) {
		case "Active":
			filterFns.push((item) => !item.is_archived);
			break;
		case "Archived":
			filterFns.push((item) => item.is_archived);
			break;
	}

	if (topics.length > 0) {
		switch (topicMatchStrategy) {
			case "Match all":
				filterFns.push(
					(item) =>
						item.topics !== undefined &&
						topics.every((topic) =>
							item.topics!.includes(topic),
						),
				);
				break;
			case "Match any":
				filterFns.push(
					(item) =>
						item.topics !== undefined &&
						topics.some((topic) =>
							item.topics!.includes(topic),
						),
				);
				break;
		}
	}
	const items = repos.filter((repo) =>
		filterFns.every((fn) => fn(repo)),
	);
	const filteredItems = matchSorter(items, name, {
		keys: ["full_name"],
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
			(item) => item.owner_type === ownerType,
		);
	}
	if (repoFullNames.length > 0) {
		filterFns.push((item) =>
			repoFullNames.includes(item.repo_full_name),
		);
	}
	if (state !== "All") {
		filterFns.push(
			(item) => item.state === state,
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
