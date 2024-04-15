import { LoaderFunction } from "react-router-dom";
import {
	getCachedRepos,
	getCachedTopics,
} from "~database/index";
import { GenericSelectOptions } from "~types/generics";
import { RepoSchema } from "~types/schemas";

export type LoaderData = {
	repos: RepoSchema[];
	topicOptions: GenericSelectOptions<string>[];
	topics: string[];
};
export const loader: LoaderFunction = async ({
	request,
}): Promise<LoaderData> => {
	document.title = "repositories";
	const topicOptions: GenericSelectOptions<string>[] =
		(await getCachedTopics()).map((topic) => {
			return { label: topic, value: topic };
		});
	const repos = await getCachedRepos();
	const topicsParam = new URL(
		request.url,
	).searchParams.get("topics");

	let topics: string[] = [];
	if (topicsParam !== null) {
		topics = topicsParam
			.normalize()
			.trim()
			.split(",")
			.map((topic) => topic.trim())
			.filter((topic) => topic.length > 0);
	}

	return {
		topicOptions,
		repos,
		topics,
	};
};
