export type RepoSchema = {
	// custom property not present from API
	readme: string | undefined; // encoded readme content
	// ---

	id: number;
	html_url: string; // link to repo
	homepage: string | null | undefined; // repo homepage, usually [username].github.io
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
	// custom property not present from API
	repo_id: number; // owner repo id
	repo_full_name: string;
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
	owner_type: string | null;
};

export type RepoIssueCommentSchema = {
	// custom property not present from API
	issue_id: number; // owner issue id

	// ---
	id: number; // self id
	html_url: string;
	created_at: string;
	updated_at: string;
	body: string | undefined;
};
