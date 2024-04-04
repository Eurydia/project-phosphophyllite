import { Octokit, RequestError } from "octokit";
import {
	RepoIssueCommentSchema,
	RepoIssueSchema,
	RepoSchema,
} from "~types/schemas";

const getToken = () => {
	const token = localStorage.getItem(
		"personal-key",
	);
	if (token === null) {
		return "-1";
	}
	return token;
};

export const getRepo = async (
	fullName: string,
) => {
	const repos = await getRepos();
	for (const repo of repos) {
		if (repo.full_name === fullName) {
			return repo;
		}
	}
	return undefined;
};

export const getRepos = async () => {
	const token = getToken();
	const octokit = new Octokit({ auth: token });
	const pages = await octokit.paginate(
		"GET /user/repos",
	);
	const repos: RepoSchema[] = await Promise.all(
		pages.map(
			async ({
				name,
				full_name,
				topics,
				created_at,
				updated_at,
				description,
				id,
				html_url,
				homepage,
				pushed_at,
				archived: is_archived,
				private: is_private,
			}) => ({
				id,
				html_url,
				homepage,
				pushed_at,
				name,
				full_name,
				description,
				topics,
				created_at,
				updated_at,
				is_archived,
				is_private,
				readme: await getRepoReadMe(full_name),
			}),
		),
	);

	return repos;
};

const getRepoReadMe = async (
	fullName: string,
) => {
	const token = getToken();
	const ocktokit = new Octokit({ auth: token });
	const [owner, repo] = fullName.split("/");
	const response = await ocktokit
		.request("GET /repos/{owner}/{repo}/readme", {
			owner,
			repo,
		})
		.then(
			(res) => res,
			(r) => {
				const _r = r as RequestError;
				if (_r.status === 404) {
					return undefined;
				}
				throw r;
			},
		);
	if (response === undefined) {
		return undefined;
	}
	return response.data.content;
};

export const getRepoIssues = async (
	fullName: string,
	repoId: number,
) => {
	const token = getToken();
	const ocktokit = new Octokit({ auth: token });
	const [owner, repo] = fullName.split("/");
	const response = await ocktokit.paginate(
		"GET /repos/{owner}/{repo}/issues",
		{
			owner,
			repo,
		},
	);
	const issues: RepoIssueSchema[] = response.map(
		({
			id,
			html_url,
			number: issue_number,
			title,
			state,
			locked,
			created_at,
			updated_at,
			closed_at,
			body,
		}) => ({
			repo_id: repoId,
			id,
			html_url,
			issue_number,
			title,
			state,
			locked,
			created_at,
			updated_at,
			closed_at,
			body,
		}),
	);
	return issues;
};

export const getRepoIssueComment = async (
	fullName: string,
	issueNumber: number,
	issueId: number,
) => {
	const token = getToken();
	const ocktokit = new Octokit({ auth: token });
	const [owner, repo] = fullName.split("/");
	const response = await ocktokit.paginate(
		"GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
		{
			owner,
			repo,
			issue_number: issueNumber,
		},
	);
	const comments: RepoIssueCommentSchema[] =
		response.map(
			({
				id,
				html_url,
				created_at,
				updated_at,
				body,
			}) => ({
				issue_id: issueId,
				html_url,
				id,
				created_at,
				updated_at,
				body,
			}),
		);
	return comments;
};
