import { invoke } from "@tauri-apps/api";
import { App } from "octokit";
import {
	CommentSchema,
	IssueSchema,
	RepoSchema,
} from "~types/schema";

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
			name,
			full_name,
			private: isPrivate,
			archived,
			description,
			pushed_at,
			created_at,
			updated_at,
		}) => {
			const status: RepoSchema["status"] =
				archived ? "Archived" : "Active";
			const visibility: RepoSchema["visibility"] =
				isPrivate ? "Private" : "Public";
			repos[full_name] = {
				id,
				htmlUrl: html_url,
				pushedAt: pushed_at,
				name,
				fullName: full_name,
				description,
				createdAt: created_at,
				updatedAt: updated_at,
				status,
				visibility,
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

export const getIssues = async (
	repoFullName: string,
	repoId: number,
) => {
	const [owner, repo, ..._] =
		repoFullName.split("/");
	const octokit = await getOctokit();
	const response = await octokit.paginate(
		"GET /repos/{owner}/{repo}/issues",
		{
			owner,
			repo,
			state: "all",
		},
	);
	const issues: IssueSchema[] = response.map(
		({
			id,
			html_url,
			number: issueNumber,
			title,
			state,
			created_at,
			updated_at,
			closed_at,
			body,
			user,
		}) => {
			const ownerType: IssueSchema["ownerType"] =
				user === null ? null : user.type;
			return {
				body,
				id,
				ownerType,
				htmlUrl: html_url,
				issueNumber,
				updatedAt: updated_at,
				createdAt: created_at,
				closedAt: closed_at,
				title,
				state,
				repoId,
				repoFullName: repoFullName,
			};
		},
	);
	return issues;
};

export const getComments = async (
	fullName: string,
	issueNumber: number,
	issueId: number,
) => {
	const [owner, repo, ..._] = fullName.split("/");
	const octokit = await getOctokit();
	const response = await octokit.paginate(
		"GET /repos/{owner}/{repo}/issues/{issue_number}/comments",
		{
			owner,
			repo,
			issue_number: issueNumber,
		},
	);
	const comments: CommentSchema[] = response.map(
		({
			id,
			html_url,
			created_at,
			updated_at,
			body,
		}) => ({
			issueId,
			htmlUrl: html_url,
			id,
			createdAt: created_at,
			updatedAt: updated_at,
			body,
		}),
	);
	return comments;
};
