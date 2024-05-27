import { invoke } from "@tauri-apps/api";
import { App } from "octokit";
import {
	RepoIssueCommentSchema,
	RepoIssueSchema,
	RepoSchema,
} from "~types/schemas";

const getOctokit = async () => {
	const installationId: string = await invoke(
		"get_installation_id",
	);
	const appId: string = await invoke(
		"get_app_id",
	);
	const privateKey: string = await invoke(
		"get_private_key",
	);

	const app = new App({
		appId,
		privateKey,
	});

	const octokit =
		await app.getInstallationOctokit(
			Number.parseInt(installationId),
		);
	return octokit;
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
	const octokit = await getOctokit();
	const pages = await octokit.paginate(
		"GET /installation/repositories",
	);

	const repos: Record<string, RepoSchema> = {};

	pages.map(
		({
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
			archived: is_archived,
			private: is_private,
		}) => {
			repos[full_name] = {
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
				readme: undefined,
			};
		},
	);
	const readmeReqs = Object.keys(repos).map(
		async (fullName) => {
			const readme = await getRepoReadMe(
				fullName,
			);
			repos[fullName].readme = readme;
		},
	);
	await Promise.all(readmeReqs);
	return Object.values(repos);
};

const getRepoReadMe = async (
	fullName: string,
) => {
	const [owner, repo, ..._] = fullName.split("/");
	const octokit = await getOctokit();
	const content = await octokit
		.request("GET /repos/{owner}/{repo}/readme", {
			owner,
			repo,
		})
		.then((res) => res.data.content)
		.catch(() => undefined);
	return content;
};

export const getRepoIssues = async (
	fullName: string,
	repoId: number,
) => {
	const [owner, repo] = fullName.split("/");
	const octokit = await getOctokit();
	const response = await octokit.paginate(
		"GET /repos/{owner}/{repo}/issues",
		{
			owner,
			repo,
			state: "all",
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
			user,
		}) => ({
			owner_type:
				user === null ? null : user.type,
			repo_id: repoId,
			repo_full_name: fullName,
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
	const [owner, repo] = fullName.split("/");
	const octokit = await getOctokit();
	const response = await octokit.paginate(
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
