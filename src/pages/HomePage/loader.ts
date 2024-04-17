import { LoaderFunction } from "react-router-dom";
import { orderByString } from "~core/sorting";
import {
	getCachedIssues,
	getCachedRepos,
} from "~database/cached";
import {
	RepoIssueSchema,
	RepoSchema,
} from "~types/schemas";

export type LoaderData = {
	activeRepos: number;
	archivedRepos: number;
	openIssues: number;
	closedIssues: number;
	recentRepos: RepoSchema[];
	recentIssues: RepoIssueSchema[];
};
export const loaderHome: LoaderFunction =
	async (): Promise<LoaderData> => {
		document.title = "~";

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

		repos.sort(
			({ pushed_at: a }, { pushed_at: b }) =>
				orderByString(a, b),
		);
		issues.sort(
			({ updated_at: a }, { updated_at: b }) =>
				orderByString(a, b),
		);
		const recentRepos = repos.slice(0, 5);
		const recentIssues = issues.slice(0, 5);

		const loaderData: LoaderData = {
			activeRepos,
			archivedRepos,
			openIssues,
			closedIssues,
			recentIssues,
			recentRepos,
		};

		return loaderData;
	};
