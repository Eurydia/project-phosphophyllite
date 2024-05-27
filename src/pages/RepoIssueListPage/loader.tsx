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
import { GenericSelectOption } from "~types/generics";
import { RepoIssueSchema } from "~types/schemas";

export type LoaderData = {
	issues: RepoIssueSchema[];
	title: string;
	ownerType: string;
	repoFullNames: string[];
	repoOptions: GenericSelectOption<string>[];
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

	const repoOptions: GenericSelectOption<string>[] =
		[
			{
				label: repo.full_name,
				value: repo.full_name,
			},
		];

	const loaderData: LoaderData = {
		issues,
		ownerType,
		repoFullNames,
		repoOptions,
		state,
		title,
	};
	return loaderData;
};
