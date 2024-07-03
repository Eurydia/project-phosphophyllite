import { LoaderFunction } from "react-router-dom";
import { filterIssues } from "~core/filtering";
import { extractIssueQuery } from "~core/query";
import { sortIssues } from "~core/sorting";
import { getCachedIssues } from "~database/cached";
import { Issue, IssueQuery } from "~types/schema";

export type LoaderData = {
	issues: Issue[];
	query: IssueQuery;
};
export const loader: LoaderFunction = async ({
	request,
}) => {
	const cachedIssues = await getCachedIssues();
	const { searchParams } = new URL(request.url);
	const query = await extractIssueQuery(
		searchParams,
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
