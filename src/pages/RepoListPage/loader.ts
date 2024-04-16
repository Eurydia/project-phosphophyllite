import { LoaderFunction } from "react-router-dom";
import { filterRepos } from "~core/filtering";
import {
	getCachedRepos,
	getCachedTopics,
} from "~database/index";
import {
	getRepoFilterPrefStatus,
	getRepoFilterPrefTopicMatchStrategy,
	getRepoFilterPrefVisibility,
} from "~database/preferences";
import { GenericSelectOptions } from "~types/generics";
import { RepoSchema } from "~types/schemas";

export type LoaderData = {
	repos: RepoSchema[];
	topicOptions: GenericSelectOptions<string>[];
	topics: string[];
	name: string;
	visibility: string;
	status: string;
	topicMatchStrategy: string;
};
export const loader: LoaderFunction = async ({
	request,
}): Promise<LoaderData> => {
	document.title = "repositories";
	const topicOptions: GenericSelectOptions<string>[] =
		(await getCachedTopics()).map((topic) => {
			return { label: topic, value: topic };
		});
	let repos = await getCachedRepos();

	const searchParams = new URL(request.url)
		.searchParams;
	const topicsParam = searchParams.get("topics");
	let topics: string[] = [];
	if (topicsParam !== null) {
		topics = topicsParam
			.normalize()
			.trim()
			.split(",")
			.map((topic) => topic.trim())
			.filter((topic) => topic.length > 0);
	}

	const name = searchParams.get("name") || "";
	const status =
		searchParams.get("status") ||
		getRepoFilterPrefStatus();
	const visibility =
		searchParams.get("visibility") ||
		getRepoFilterPrefVisibility();
	const topicMatchStrategy =
		searchParams.get("topicMatchStrategy") ||
		getRepoFilterPrefTopicMatchStrategy();
	repos = filterRepos(
		repos,
		name,
		topics,
		visibility,
		status,
		topicMatchStrategy,
	);

	return {
		topicOptions,
		repos,
		topics,
		name,
		visibility,
		status,
		topicMatchStrategy,
	};
};
