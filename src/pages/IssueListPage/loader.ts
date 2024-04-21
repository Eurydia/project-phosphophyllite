import { LoaderFunction } from "react-router-dom";
import { filterIssues } from "~core/filtering";
import { getCachedIssues } from "~database/index";
import {
	getIssueFilterPrefOwnerType,
	getIssueFilterPrefState,
} from "~database/preferences";
import { GenericSelectOption } from "~types/generics";
import { RepoIssueSchema } from "~types/schemas";

export type LoaderData = {
	issues: RepoIssueSchema[];
	repoOptions: GenericSelectOption<string>[];
	title: string;
	ownerType: string;
	repoFullNames: string[];
	state: string;
};
export const loader: LoaderFunction = async ({
	request,
}): Promise<LoaderData> => {
	document.title = "issues";
	let issues = await getCachedIssues();

	const uniqueRepoOptions = new Set(
		issues
			.map(({ repo_full_name }) => repo_full_name)
			.filter((value) => value.length > 0),
	);
	const options = [...uniqueRepoOptions];
	options.sort();
	const repoOptions: GenericSelectOption<string>[] =
		options.map((value) => ({
			label: value,
			value,
		}));

	const searchParams = new URL(request.url)
		.searchParams;

	const repoFullNamesParam = searchParams.get(
		"repoFullNames",
	);
	let repoFullNames: string[] = [];
	if (repoFullNamesParam !== null) {
		repoFullNames = repoFullNamesParam
			.normalize()
			.trim()
			.split(",")
			.map((item) => item.trim())
			.filter((item) => item.length > 0);
	}

	const title = searchParams.get("title") || "";

	const ownerType =
		searchParams.get("ownerType") ||
		getIssueFilterPrefOwnerType();
	const state =
		searchParams.get("state") ||
		getIssueFilterPrefState();

	issues = filterIssues(
		issues,
		title,
		ownerType,
		repoFullNames,
		state,
	);

	return {
		issues,
		repoOptions,
		title,
		ownerType,
		repoFullNames,
		state,
	};
};
