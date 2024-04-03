import { matchSorter } from "match-sorter";
import { LoaderFunction } from "react-router-dom";
import {
	getCachedRepos,
	getCachedTopics,
	getRepos,
} from "~database/index";
import { SortRule } from "~types/generics";
import { RepositorySchema } from "~types/schemas";

export const sortRules: SortRule<RepositorySchema>[] =
	[
		{
			value: "by_update_LATEST_FIRST",
			label: "Last modified (Latest first)",
			compareFn: (a, b) => {
				if (
					a.updated_at === null ||
					b.updated_at === null
				) {
					return 0;
				}
				return b.updated_at.localeCompare(
					a.updated_at,
				);
			},
		},
		{
			value: "by_update_OLDEST_FIRST",
			label: "Last modified (Oldest first)",
			compareFn: (a, b) => {
				if (
					a.updated_at === null ||
					b.updated_at === null
				) {
					return 0;
				}
				return a.updated_at.localeCompare(
					b.updated_at,
				);
			},
		},
		{
			value: "by_name_ASCENDING",
			label: "Name (A-Z)",
			compareFn: (a, b) =>
				a.name.localeCompare(b.name),
		},
		{
			value: "by_name_DESCENDING",
			label: "Name (Z-A)",
			compareFn: (a, b) =>
				b.name.localeCompare(a.name),
		},
	];

export type LoaderData = {
	name: string;
	repos: RepositorySchema[];
	sort: string;
	topics: string[];
	topicOptions: string[];
};
export const loaderHome: LoaderFunction = async ({
	request,
}): Promise<LoaderData> => {
	const searchParams = new URL(request.url)
		.searchParams;

	const sortParam = searchParams.get("sort");
	let sort = sortRules[0];
	if (sortParam !== null && sortParam !== "") {
		for (const sortRule of sortRules) {
			if (sortParam === sortRule.value) {
				sort = sortRule;
				break;
			}
		}
	}

	const topicParam = searchParams.get("topics");
	let topics: string[] = [];
	if (topicParam !== null && topicParam !== "") {
		topics = topicParam
			.split(",")
			.filter((topic) => topic.length > 0);
	}

	const nameParam = searchParams.get("name");
	let name = "";
	if (nameParam !== null) {
		name = nameParam;
	}

	document.title = "Repositories";
	const topicOptions = await getCachedTopics();
	let repos =
		(await getCachedRepos()) ||
		(await getRepos());
	repos = matchSorter(repos, name, {
		keys: ["name"],
	});
	if (topics.length > 0) {
		repos = repos.filter((repo) => {
			const { topics: rTopics } = repo;
			if (rTopics === undefined) {
				return false;
			}
			return topics.every((topic) =>
				rTopics.includes(topic),
			);
		});
	}
	repos.sort(sort.compareFn);

	return {
		name,
		topicOptions,
		repos,
		sort: sort.value,
		topics,
	};
};
