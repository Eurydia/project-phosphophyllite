import { LoaderFunction } from "react-router";
import { getCachedRepo } from "~database/cached";
import { RepoSchema } from "~types/schemas";

export type LoaderData = {
	repo: RepoSchema;
	// issues: RepoIssueSchema[];
	// title: string;
	// ownerType: string;
	// repoFullNames: string[];
	// repoOptions: GenericSelectOption<string>[];
	// state: string;
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

	const loaderData: LoaderData = {
		repo,
		// issues,
		// title,
		// ownerType,
		// repoFullNames,
		// state,
		// repoOptions,
	};

	return loaderData;
};
