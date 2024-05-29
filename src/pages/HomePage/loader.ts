import { LoaderFunction } from "react-router-dom";
import {
	getCachedIssues,
	getCachedRepos,
} from "resources/cached";

export type LoaderData = {
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
			({ is_archived }) => !is_archived,
		).length;
		const openIssues = humanIssues.filter(
			({ state }) => state === "open",
		).length;
		const archivedRepos =
			cachedRepos.length - activeRepos;
		const closedIssues =
			humanIssues.length - openIssues;

		const loaderData: LoaderData = {
			activeRepos,
			archivedRepos,
			openIssues,
			closedIssues,
		};

		return loaderData;
	};
