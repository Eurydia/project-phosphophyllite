import { LoaderFunction } from "react-router-dom";
import { getCachedIssuesAll } from "~database/index";
import { GenericSelectOptions } from "~types/generics";
import { RepoIssueSchema } from "~types/schemas";

export type LoaderData = {
	issues: RepoIssueSchema[];
	repoOptions: GenericSelectOptions<string>[];
};
export const loader: LoaderFunction =
	async (): Promise<LoaderData> => {
		document.title = "issues";
		const issues = await getCachedIssuesAll();

		const uniqueRepoOptions = new Set(
			issues
				.map(
					({ repo_full_name }) => repo_full_name,
				)
				.filter((value) => value.length > 0),
		);
		const options = [...uniqueRepoOptions];
		options.sort();
		const repoOptions: GenericSelectOptions<string>[] =
			options.map((value) => ({
				label: value,
				value,
			}));

		return {
			issues,
			repoOptions,
		};
	};
