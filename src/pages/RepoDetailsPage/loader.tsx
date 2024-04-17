import { LoaderFunction } from "react-router";
import { filterIssues } from "~core/filtering";
import {
	getCachedRepo,
	getCachedRepoIssues,
} from "~database/cached";
import {
	getIssueFilterPrefOwnerType,
	getIssueFilterPrefState,
} from "~database/preferences";
import { GenericSelectOptions } from "~types/generics";
import {
	RepoIssueSchema,
	RepoSchema,
} from "~types/schemas";

export type LoaderData = {
	repo: RepoSchema;
	issues: RepoIssueSchema[];
	title: string;
	ownerType: string;
	repoFullNames: string[];
	repoOptions: GenericSelectOptions<string>[];
	state: string;
};
export const loader: LoaderFunction = async ({
	params,
	request,
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

	const searchParams = new URL(request.url)
		.searchParams;
	const title = searchParams.get("title") || "";
	const ownerType =
		searchParams.get("ownerType") ||
		getIssueFilterPrefOwnerType();
	const state =
		searchParams.get("state") ||
		getIssueFilterPrefState();

	let issues = await getCachedRepoIssues(
		repo.full_name,
	);
	const repoFullNames: string[] = [
		repo.full_name,
	];
	issues = filterIssues(
		issues,
		title,
		ownerType,
		repoFullNames,
		state,
	);

	const repoOptions: GenericSelectOptions<string>[] =
		[
			{
				label: repo.full_name,
				value: repo.full_name,
			},
		];
	const loaderData: LoaderData = {
		repo,
		issues,
		title,
		ownerType,
		repoFullNames,
		state,
		repoOptions,
	};

	return loaderData;
};
