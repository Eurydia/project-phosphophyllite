export type RepoSchema = {
	readme: string | undefined;
	id: number;
	htmlUrl: string;
	name: string;
	fullName: string;
	description: string | null;
	topics: string[] | undefined;
	pushedAt: string | null;
	createdAt: string | null;
	updatedAt: string | null;
	visibility: "Public" | "Private";
	status: "Active" | "Archived";
};

export type IssueSchema = {
	repoId: number;
	repoFullName: string;
	id: number;
	htmlUrl: string;
	issueNumber: number;
	title: string;
	state: string;
	createdAt: string;
	updatedAt: string;
	closedAt: string | null;
	body: string | null | undefined;
	ownerType: string | null;
};

export type CommentSchema = {
	issueId: number;
	id: number;
	htmlUrl: string;
	createdAt: string;
	updatedAt: string;
	body: string | undefined;
};
