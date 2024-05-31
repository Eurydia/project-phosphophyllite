import { LoaderFunction } from "react-router-dom";
import {
	getCachedIssues,
	getCachedRepos,
} from "resources/cached";
import { sortByString } from "~core/sorting";
import { IssueSchema } from "~types/schema";

export type LoaderData = {
	recentIssues: IssueSchema[];
	activeRepos: number;
	archivedRepos: number;
	openIssues: number;
	closedIssues: number;
};
export const loaderHome: LoaderFunction =
	async (): Promise<LoaderData> => {
		const cachedRepos = await getCachedRepos();
		const cachedIssues = (
			await getCachedIssues()
		).filter(
			({ ownerType }) => ownerType === "User",
		);

		const activeRepos = cachedRepos.filter(
			({ status }) => status === "Active",
		).length;
		const openIssues = cachedIssues.filter(
			({ state }) => state === "open",
		).length;
		const archivedRepos =
			cachedRepos.length - activeRepos;
		const closedIssues =
			cachedIssues.length - openIssues;

		const recentIssues = cachedIssues
			.sort((a, b) =>
				sortByString(a.updatedAt, b.updatedAt),
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
