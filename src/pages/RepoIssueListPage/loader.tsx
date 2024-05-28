import { LoaderFunction } from "react-router";
import { filterIssues } from "~core/filtering";
import { extractIssueQuery } from "~core/query";
import {
	getCachedIssues,
	getCachedRepo,
} from "~database/cached";
import { SelectOption } from "~types/generics";
import { IssueQuery } from "~types/query";
import { IssueSchema } from "~types/schemas";

export type LoaderData = {
	issues: IssueSchema[];
	query: IssueQuery;
	repoOptions: SelectOption<string>[];
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
	const { searchParams } = new URL(request.url);
	const query = extractIssueQuery(searchParams);

	const cachedIssues = await getCachedIssues(
		repo.full_name,
	);
	const issues = filterIssues(
		cachedIssues,
		query,
	);
	const repoOptions: SelectOption<string>[] = [
		{
			label: repo.full_name,
			value: repo.full_name,
		},
	];

	const loaderData: LoaderData = {
		issues,
		repoOptions,
		query,
	};
	return loaderData;
};
