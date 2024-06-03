import { LoaderFunction } from "react-router-dom";
import { getCachedRepos } from "resources/cached";
import { filterRepos } from "~core/filtering";
import { extractRepoQuery } from "~core/query";
import { sortByString } from "~core/sorting";
import { RepoQuery } from "~types/query";
import { RepoSchema } from "~types/schema";

export type LoaderData = {
	repos: RepoSchema[];
	query: RepoQuery;
};
export const loader: LoaderFunction = async ({
	request,
}) => {
	const { searchParams } = new URL(request.url);
	const query = await extractRepoQuery(
		searchParams,
	);
	const cachedRepos = await getCachedRepos();
	const repos = filterRepos(
		cachedRepos,
		query,
	).sort((a, b) =>
		sortByString(
			b[query.sortBy] as string,
			a[query.sortBy] as string,
		),
	);
	const loaderData: LoaderData = {
		repos,
		query,
	};
	return loaderData;
};
