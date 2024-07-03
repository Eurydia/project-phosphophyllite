// import { LoaderFunction } from "react-router";
// import { filterRepos } from "~core/filtering";
// import { extractRepoQuery } from "~core/query";
// import { sortRepos } from "~core/sorting";
// import { getCachedRepos } from "~database/cached";
// import {
// 	RepoQuery,
// 	Repository,
// } from "~types/schema";

// export type LoaderData = {
// 	repos: Repository[];
// 	query: RepoQuery;
// };
// export const loader: LoaderFunction = async ({
// 	request,
// }) => {
// 	const { searchParams } = new URL(request.url);
// 	const query = await extractRepoQuery(
// 		searchParams,
// 	);
// 	const cachedRepos = await getCachedRepos();
// 	const repos = filterRepos(cachedRepos, query);
// 	sortRepos(repos, query);
// 	const loaderData: LoaderData = {
// 		repos,
// 		query,
// 	};
// 	return loaderData;
// };
