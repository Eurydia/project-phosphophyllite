export type RepoSchema = {
	// KEY PROPERTIES
	id: number;

	// QUERY PROPERTIES
	name: string;
	fullName: string;
	visibility: "public" | "private";
	status: "active" | "archived";

	// SORT PROPERTIES
	pushedAt: string | null;
	createdAt: string | null;
	updatedAt: string | null;

	// DETAIL PROEPRTIES
	readme: string | undefined;
	htmlUrl: string;
	description: string | null;
};

export type IssueSchema = {
	// KEY PROPERTIES
	id: number;
	repoId: number;

	// QUERY PROPERTIES
	repoFullName: string;
	issueNumber: number;
	title: string;
	state: string;
	ownerType: string | null;

	// SORT PROPERTIES
	createdAt: string;
	updatedAt: string;
	closedAt: string | null;

	// DETAIL PROPERTIES
	htmlUrl: string;
	body: string | null | undefined;
};

export type CommentSchema = {
	// KEY PROPERTIES
	id: number;

	// DETAIL PROPERTIES
	issueId: number;
	htmlUrl: string;
	body: string | undefined;
	createdAt: string;
	updatedAt: string;
};

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
};

export type IssueQueryPref = {
	ownerType: "all" | "bot" | "user";
	state: "all" | "open" | "closed";
	sortBy: keyof IssueSchema;
	sortOrder: "asc" | "desc";
};

export type MiscData = {
	repoDataLastUpdate: string | undefined;
	issueDataLastUpdate: string | undefined;
	commentDataLastUpdate: string | undefined;
};
