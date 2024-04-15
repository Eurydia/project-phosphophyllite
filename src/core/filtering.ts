import { matchSorter } from "match-sorter";
import {
	RepoIssueSchema,
	RepoSchema,
} from "~types/schemas";

export const filterRepos = (
	repos: RepoSchema[],
	name: string,
	topics: string[],
	visibility: string,
	status: string,
	topicFilterMode: string,
) => {
	let items = [...repos];

	if (visibility === "Private") {
		items = items.filter(
			(item) => item.is_private,
		);
	}
	if (visibility === "Public") {
		items = items.filter(
			(item) => !item.is_private,
		);
	}

	if (status === "Archived") {
		items = items.filter(
			(item) => item.is_archived,
		);
	}
	if (status === "Active") {
		items = items.filter(
			(item) => !item.is_archived,
		);
	}

	if (
		topics.length > 0 &&
		topicFilterMode === "Match all"
	) {
		items = items.filter((item) =>
			topics.every((topic) => {
				if (item.topics === undefined) {
					return false;
				}
				return item.topics.includes(topic);
			}),
		);
	}
	if (
		topics.length > 0 &&
		topicFilterMode === "Match any"
	) {
		items = items.filter((item) =>
			topics.some((topic) => {
				if (item.topics === undefined) {
					return false;
				}
				return item.topics.includes(topic);
			}),
		);
	}

	items = matchSorter(items, name, {
		keys: ["full_name"],
	});
	return items;
};

export const filterIssues = (
	issues: RepoIssueSchema[],
	title: string,
	ownerType: string,
	repoFullNames: string[],
	state: string,
) => {
	let items = [...issues];

	if (ownerType !== "All") {
		items = items.filter(
			(item) => item.owner_type === ownerType,
		);
	}
	if (repoFullNames.length > 0) {
		items = items.filter((item) =>
			repoFullNames.includes(item.repo_full_name),
		);
	}
	if (state !== "All") {
		items = items.filter(
			(item) => item.state === state,
		);
	}

	items = matchSorter(items, title, {
		keys: ["title"],
	});
	return items;
};
