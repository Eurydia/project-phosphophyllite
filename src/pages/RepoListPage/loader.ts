import { matchSorter } from "match-sorter";
import { LoaderFunction } from "react-router-dom";
import {
	getCachedRepos,
	getCachedTopics,
	getRepos,
} from "~database/index";
import { RepoSchema } from "~types/schemas";

export type LoaderData = {
	name: string;
	repos: RepoSchema[];
	topics: string[];
	topicOptions: string[];
};
export const loader: LoaderFunction = async ({
	request,
}): Promise<LoaderData> => {
	const searchParams = new URL(request.url)
		.searchParams;

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
		keys: ["full_name"],
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

	return {
		name,
		topicOptions,
		repos,
		topics,
	};
};
