import {
	syncCachedRepoIssueComments,
	syncCachedRepoIssues,
	syncCachedRepos,
} from "~database/cached";

export * from "./ISSUE_FILTER_OPTIONS";
export * from "./REPO_FILTER_OPTIONS";

export const SYNC_DETAILS: {
	item: string;
	promise: (
		onFailure: (err: any) => void,
	) => Promise<boolean[]>;
}[] = [
	{
		item: "Repsitories",
		promise: (onFailure) =>
			syncCachedRepos(onFailure),
	},
	{
		item: "Issues",
		promise: (onFailure) =>
			syncCachedRepoIssues(onFailure),
	},
	{
		item: "Comments",
		promise: (onFailure) =>
			syncCachedRepoIssueComments(onFailure),
	},
];
