import { LoaderFunction } from "react-router-dom";
import {
	getCachedIssues,
	getCachedRepos,
} from "~database/cached";

export type LoaderData = {
	activeRepos: number;
	archivedRepos: number;
	openIssues: number;
	closedIssues: number;
};
export const loaderHome: LoaderFunction =
	async (): Promise<LoaderData> => {
		const repos = await getCachedRepos();
		const issues = (
			await getCachedIssues()
		).filter(
			({ owner_type }) => owner_type === "User",
		);

		const activeRepos = repos.filter(
			({ is_archived }) => !is_archived,
		).length;
		const archivedRepos =
			repos.length - activeRepos;
		const openIssues = issues.filter(
			({ state }) => state === "open",
		).length;
		const closedIssues =
			issues.length - openIssues;

		const loaderData: LoaderData = {
			activeRepos,
			archivedRepos,
			openIssues,
			closedIssues,
		};

		return loaderData;
	};
