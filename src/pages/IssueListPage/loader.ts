import { LoaderFunction } from "react-router-dom";
import {
	getCachedIssues,
	getRepoOptions,
} from "resources/cached";
import { filterIssues } from "~core/filtering";
import { extractIssueQuery } from "~core/query";
import { SelectOption } from "~types/generic";
import { IssueQuery } from "~types/query";
import { Issue } from "~types/schema";

export type LoaderData = {
	issues: Issue[];
	repoOptions: SelectOption<string>[];
	query: IssueQuery;
};
export const loader: LoaderFunction = async ({
	request,
}) => {
	const cachedIssues = await getCachedIssues();
	const repoOptions = await getRepoOptions();
	const { searchParams } = new URL(request.url);
	const query = await extractIssueQuery(
		searchParams,
	);
	const issues = filterIssues(
		cachedIssues,
		query,
	);
	const loaderData: LoaderData = {
		issues,
		repoOptions,
		query,
	};
	return loaderData;
};
