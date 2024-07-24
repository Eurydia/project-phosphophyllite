export type AppRepository = {
	url: string;
	name: string;
	full_name: string;
	owner_login: string;
	pushed_at: string;
	created_at: string;
	updated_at: string;
	private: boolean;
	archived: boolean;
	visibility: string;
	html_url: string;
	description: string;
	readme: string;
};

export type AppIssue = {
	url: string;
	repository_url: string;
	title: string;
	body: string;
	state: string;
	number: number;
	html_url: string;
	created_at: string;
	updated_at: string;
	closed_at: string;
	user_type: string;
	issue_label: string;
};

export type AppComment = {
	url: string;
	issue_url: string;
	id: number;
	body: string;
	html_url: string;
	created_at: string;
	updated_at: string;
};
