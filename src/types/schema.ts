export type RepoSchema = {
	// KEY PROPERTIES
	id: number;

	// QUERY PROPERTIES
	name: string;
	fullName: string;
	visibility: "Public" | "Private";
	status: "Active" | "Archived";

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
