import { ReactNode } from "react";
import { toTimeStamp } from "~core/time";
import {
	syncCachedRepoIssueComments,
	syncCachedRepoIssues,
	syncCachedRepos,
} from "~database/cached";
import { RepoSchema } from "~types/schemas";

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

export const REPO_METADATA_DEFINITIONS: {
	label: string;
	render: (repo: RepoSchema) => ReactNode;
}[] = [
	{
		label: "Description",
		render: (repo) =>
			repo.description ?? "No description",
	},
	{
		label: "Last pushed",
		render: (repo) =>
			toTimeStamp(repo.pushed_at, "Never"),
	},
	{
		label: "Last updated",
		render: (repo) =>
			toTimeStamp(repo.updated_at, "Never"),
	},
	{
		label: "Created",
		render: (repo) =>
			toTimeStamp(repo.created_at, "Unknown"),
	},
];
