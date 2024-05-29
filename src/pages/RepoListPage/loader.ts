import { LoaderFunction } from "react-router-dom";
import {
	getCachedRepos,
	getTopicOptions,
} from "resources/cached";
import { filterRepos } from "~core/filtering";
import { extractRepoQuery } from "~core/query";
import { SelectOption } from "~types/generic";
import { RepoQuery } from "~types/query";
import { RepoSchema } from "~types/schema";

export type LoaderData = {
	repos: RepoSchema[];
	query: RepoQuery;
	topicOptions: SelectOption<string>[];
};
export const loader: LoaderFunction = async ({
	request,
}) => {
	const { searchParams } = new URL(request.url);
	const query = await extractRepoQuery(
		searchParams,
	);
	const cachedRepos = await getCachedRepos();
	const repos = filterRepos(cachedRepos, query);
	const topicOptions = await getTopicOptions();
	const loaderData: LoaderData = {
		topicOptions,
		repos,
		query,
	};
	return loaderData;
};
