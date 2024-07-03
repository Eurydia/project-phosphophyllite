import { LoaderFunction } from "react-router";

import { filterIssues } from "~core/filtering";
import { extractIssueQuery } from "~core/query";
import { sortIssues } from "~core/sorting";
import {
	getCachedIssues,
	getCachedRepo,
} from "~database/cached";
import { Issue, IssueQuery } from "~types/schema";

export type LoaderData = {
	issues: Issue[];
	query: IssueQuery;
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
			statusText: "Repository is not in cache",
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
	sortIssues(issues, query);
	const loaderData: LoaderData = {
		issues,
		query,
	};
	return loaderData;
};
