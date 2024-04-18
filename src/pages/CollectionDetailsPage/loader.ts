import { LoaderFunction } from "react-router-dom";
import {
	getCachedRepo,
	getCachedRepos,
	getCollection,
} from "~database/index";
import {
	CollectionSchema,
	RepoSchema,
} from "~types/schemas";

export type LoaderData = {
	repos: string[];
	collection: CollectionSchema;
	collectedRepos: RepoSchema[];
};
export const loader: LoaderFunction = async ({
	params,
}): Promise<LoaderData> => {
	const nameParam = params.collectionName;
	if (nameParam === undefined) {
		throw new Response("", {
			status: 400,
			statusText: "Bad requeset",
		});
	}

	const collection = await getCollection(
		nameParam,
	);
	if (collection === undefined) {
		throw new Response("", {
			status: 400,
			statusText: "Bad requeset",
		});
	}

	document.title = nameParam;
	const repos = (await getCachedRepos()).map(
		({ full_name }) => full_name,
	);

	const reposReqs = collection.repos.map((repo) =>
		getCachedRepo(repo),
	);
	const collectedRepos = (
		await Promise.all(reposReqs)
	).filter(
		(repo) => repo !== undefined,
	) as RepoSchema[];

	const loaderData: LoaderData = {
		repos,
		collection,
		collectedRepos,
	};
	return loaderData;
};
