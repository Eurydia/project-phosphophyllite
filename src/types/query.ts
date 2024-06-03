import { RepoSchema } from "./schema";

export type RepoQuery = RepoQueryPref & {
	fullName: string;
};

export type RepoQueryPref = {
	status: "all" | "active" | "archived";
	visibility: "all" | "private" | "public";
	sortBy: keyof RepoSchema;
	sortOrder: "asc" | "desc";
};

export type IssueQuery = IssueQueryPref & {
	title: string;
	repoFullNames: string[];
};

export type IssueQueryPref = {
	ownerType: "all" | "bot" | "user";
	state: "all" | "open" | "closed";
};
