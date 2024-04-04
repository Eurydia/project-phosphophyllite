export type RepoSchema = {
	readme: string | undefined; // encoded readme content
	// ---

	id: number;
	html_url: string; // link to repo
	homepage: string | null; // repo homepage, usually [username].github.io
	name: string; // repo name
	full_name: string; // "[owner]/[repo_name]"
	description: string | null; // small description
	topics: string[] | undefined; // list of topics
	pushed_at: string | null;
	created_at: string | null;
	updated_at: string | null;
	is_private: boolean;
	is_archived: boolean;
};

export type RepoIssueSchema = {
	repo_id: number; // owner repo id
	// ---

	id: number; // self id
	html_url: string; // link to issue
	issue_number: number;
	title: string;
	state: string;
	locked: boolean;
	created_at: string;
	updated_at: string;
	closed_at: string | null;
	body: string | null | undefined;
};

export type RepoIssueCommentSchema = {
	issue_id: number; // owner issue id
	// ---
	id: number; // self id
	html_url: string;
	created_at: string;
	updated_at: string;
	body: string | undefined;
};
