import { LoaderFunction } from "react-router";
import {
	getCachedIssues,
	getCachedRepo,
} from "resources/cached";
import { filterIssues } from "~core/filtering";
import { extractIssueQuery } from "~core/query";
import { SelectOption } from "~types/generic";
import { IssueQuery } from "~types/query";
import { Issue } from "~types/schema";

export type LoaderData = {
	issues: Issue[];
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
	const query = await extractIssueQuery(
		searchParams,
	);

	const cachedIssues = await getCachedIssues(
		repo.fullName,
	);
	const issues = filterIssues(
		cachedIssues,
		query,
	);
	const repoOptions: SelectOption<string>[] = [
		{
			label: repo.fullName,
			value: repo.fullName,
		},
	];
	const loaderData: LoaderData = {
		issues,
		repoOptions,
		query,
	};
	return loaderData;
};
