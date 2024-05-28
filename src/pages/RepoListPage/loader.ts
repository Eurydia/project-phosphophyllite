import { LoaderFunction } from "react-router-dom";
import { filterRepos } from "~core/filtering";
import { extractRepoQuery } from "~core/query";
import {
	getCachedRepos,
	getTopicOptions,
} from "~database/index";
import { SelectOption } from "~types/generics";
import { RepoQuery } from "~types/query";
import { RepoSchema } from "~types/schemas";

export type LoaderData = {
	repos: RepoSchema[];
	query: RepoQuery;
	topicOptions: SelectOption<string>[];
};
export const loader: LoaderFunction = async ({
	request,
}) => {
	const { searchParams } = new URL(request.url);
	const query = extractRepoQuery(searchParams);
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
