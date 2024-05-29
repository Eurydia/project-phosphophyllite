export type RepoQuery = {
	name: string;
	topics: string[];
} & RepoQueryPref;

export type RepoQueryPref = {
	status: "All" | "Active" | "Archived";
	visibility: "All" | "Private" | "Public";
	topicMatchStrategy: "Match all" | "Match any";
};

export type IssueQuery = {
	title: string;
	repoFullNames: string[];
} & IssueQueryPref;

export type IssueQueryPref = {
	ownerType: "All" | "Bot" | "User";
	state: "All" | "Open" | "Closed";
};

export type SyncData = {
	repoLastSync: string;
	issueLastSync: string;
	commentLastSync: string;
};
