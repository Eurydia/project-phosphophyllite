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
		item: "Repsitory",
		promise: (onFailure) =>
			syncCachedRepos(onFailure),
	},
	{
		item: "Issue",
		promise: (onFailure) =>
			syncCachedRepoIssues(onFailure),
	},
	{
		item: "Comment",
		promise: (onFailure) =>
			syncCachedRepoIssueComments(onFailure),
	},
];
