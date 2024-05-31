import { LoaderFunction } from "react-router-dom";
import {
	getCachedIssues,
	getCachedRepos,
} from "resources/cached";
import { sortByString } from "~core/sorting";
import { Issue } from "~types/schema";

export type LoaderData = {
	recentIssues: Issue[];
	activeRepos: number;
	archivedRepos: number;
	openIssues: number;
	closedIssues: number;
};
export const loaderHome: LoaderFunction =
	async (): Promise<LoaderData> => {
		const cachedRepos = await getCachedRepos();
		const cachedIssues = await getCachedIssues();
		const humanIssues = cachedIssues.filter(
			({ owner_type }) => owner_type === "User",
		);

		const activeRepos = cachedRepos.filter(
			({ status: is_archived }) => !is_archived,
		).length;
		const openIssues = humanIssues.filter(
			({ state }) => state === "open",
		).length;
		const archivedRepos =
			cachedRepos.length - activeRepos;
		const closedIssues =
			humanIssues.length - openIssues;

		const recentIssues = cachedIssues
			.sort((a, b) =>
				sortByString(a.updated_at, b.updated_at),
			)
			.slice(0, 5);

		const loaderData: LoaderData = {
			recentIssues,
			activeRepos,
			archivedRepos,
			openIssues,
			closedIssues,
		};

		return loaderData;
	};
