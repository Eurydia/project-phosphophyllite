import { LoaderFunction } from "react-router";
import {
	getCachedIssues,
	getCachedRepo,
} from "~database/cached";
import {
	RepoIssueSchema,
	RepoSchema,
} from "~types/schemas";

export type LoaderData = {
	repo: RepoSchema;
	issues: RepoIssueSchema[];
};
export const loader: LoaderFunction = async ({
	params,
}) => {
	const owner = params.owner;
	const repoName = params.repo;
	if (
		owner === undefined ||
		repoName === undefined
	) {
		throw new Response("", {
			status: 400,
			statusText: "Bad requeset",
		});
	}

	const fullName = `${owner}/${repoName}`;
	let repo = await getCachedRepo(fullName);
	if (repo === undefined) {
		throw new Response("Not found", {
			status: 404,
			statusText: "Repository not found in cache",
		});
	}
	document.title = repo.name;
	const loaderData: LoaderData = {
		repo,
		issues: await getCachedIssues(repo.id),
	};

	return loaderData;
};
