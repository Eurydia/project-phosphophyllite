import { App } from "octokit";
import {
	getAppID,
	getInstallationID,
	getPublicKey,
} from "~api/secrets";
import {
	Comment,
	Repository,
} from "~types/schema";

const getOctokit = async () => {
	const installationId =
		await getInstallationID();
	const appId = await getAppID();
	const publicKey = await getPublicKey();

	const app = new App({
		appId,
		privateKey: publicKey,
	});

	const octokit =
		await app.getInstallationOctokit(
			Number.parseInt(installationId),
		);
	return octokit;
};

export const getRepositories = async () => {
	const octokit = await getOctokit();
	const pages = await octokit.paginate(
		"GET /installation/repositories",
	);
	const repos: Record<string, Repository> = {};
	for (const item of pages) {
		const {
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
		} = item;
		const status: Repository["status"] = archived
			? "archived"
			: "active";
		const visibility: Repository["visibility"] =
			isPrivate ? "private" : "public";
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
	}

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
	const pages = await octokit.paginate(
		"GET /repos/{owner}/{repo}/issues",
		{
			owner,
			repo,
			state: "all",
		},
	);
	const issues = pages.map(
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
			const ownerType =
				user === null
					? null
					: user.type.toLowerCase();
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
	const comments: Comment[] = response.map(
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
