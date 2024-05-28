import { LoaderFunction } from "react-router-dom";
import { filterIssues } from "~core/filtering";
import { extractIssueQuery } from "~core/query";
import {
	getCachedIssues,
	getRepoOptions,
} from "~database/index";
import { SelectOption } from "~types/generics";
import { IssueQuery } from "~types/query";
import { IssueSchema } from "~types/schemas";

export type LoaderData = {
	issues: IssueSchema[];
	repoOptions: SelectOption<string>[];
	query: IssueQuery;
};
export const loader: LoaderFunction = async ({
	request,
}) => {
	const cachedIssues = await getCachedIssues();
	const repoOptions = await getRepoOptions();

	const { searchParams } = new URL(request.url);
	const query = extractIssueQuery(searchParams);

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
