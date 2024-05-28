export type RepoQuery = {
	name: string;
	topics: string[];
	status: "All" | "Active" | "Archived";
	visibility: "All" | "Private" | "Public";
	topicMatchStrategy: "Match all" | "Match any";
};

export type IssueQuery = {
	title: string;
	repoFullNames: string[];
	ownerType: "All" | "Bot" | "User";
	state: "All" | "Open" | "Closed";
};
