export type RepoQuery = RepoQueryPref & {
	name: string;
};

export type RepoQueryPref = {
	status: "All" | "Active" | "Archived";
	visibility: "All" | "Private" | "Public";
};

export type IssueQuery = IssueQueryPref & {
	title: string;
	repoFullNames: string[];
};

export type IssueQueryPref = {
	ownerType: "All" | "Bot" | "User";
	state: "All" | "Open" | "Closed";
};
