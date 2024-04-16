import { dbPromise } from "~database/migration";
import {
	RepoIssueCommentSchema,
	RepoIssueSchema,
	RepoSchema,
} from "~types/schemas";
import {
	getRepoIssueComment,
	getRepoIssues,
	getRepos,
} from "./api";

export const getCachedRepos = async () => {
	return (await dbPromise).getAll("repos");
};

export const getCachedRepo = async (
	fullName: string,
) => {
	return (await dbPromise).getFromIndex(
		"repos",
		"by-full_name",
		fullName,
	);
};

export const getCachedTopics = async () => {
	const repos = await getCachedRepos();
	const uniqueTopics = new Set<string>();
	for (const repo of repos) {
		if (repo.topics === undefined) {
			continue;
		}
		for (const topic of repo.topics) {
			uniqueTopics.add(topic);
		}
	}
	const topics = [...uniqueTopics];
	topics.sort();
	return topics;
};

export const getCachedIssues = async () => {
	return dbPromise.then((db) =>
		db.getAll("issues"),
	);
};

export const getCachedRepoIssues = async (
	repoFullName: string,
) => {
	const repo = await getCachedRepo(repoFullName);
	if (repo === undefined) {
		return [];
	}
	return (await dbPromise).getAllFromIndex(
		"issues",
		"by-repo_id",
		repo.id,
	);
};

export const getCachedRepoIssue = async (
	repoFullName: string,
	issueNumber: number,
) => {
	const issues = await getCachedRepoIssues(
		repoFullName,
	);
	for (const issue of issues) {
		if (issue.issue_number === issueNumber) {
			return issue;
		}
	}
	return undefined;
};

export const getCachedIssueComments = async (
	issueId: number,
) => {
	return (await dbPromise).getAllFromIndex(
		"issueComments",
		"by-issue_id",
		issueId,
	);
};

const updateCachedRepos = async (
	repos: RepoSchema[],
) => {
	const db = await dbPromise;
	return await Promise.all(
		repos.map((repo) => db.put("repos", repo)),
	);
};

const updateCachedRepoIssues = async (
	issues: RepoIssueSchema[],
) => {
	const db = await dbPromise;
	return await Promise.all(
		issues.map((issue) =>
			db.put("issues", issue),
		),
	);
};

const updateCachedRepoIssueComments = async (
	issueComments: RepoIssueCommentSchema[],
) => {
	const db = await dbPromise;
	return await Promise.all(
		issueComments.map((comment) =>
			db.put("issueComments", comment),
		),
	);
};

export const syncCachedRepos = async (
	onFailure: (err: any) => void,
) => {
	return await getRepos().then(
		(res) => {
			updateCachedRepos(res);
			return [true];
		},
		(err) => {
			onFailure(err);
			return [false];
		},
	);
};
export const syncCachedRepoIssues = async (
	onFailure: (err: any) => void,
) => {
	const cachedRepos = await getCachedRepos();
	return await Promise.all(
		cachedRepos.map(async (repo) => {
			return await getRepoIssues(
				repo.full_name,
				repo.id,
			).then(
				(res) => {
					updateCachedRepoIssues(res);
					return true;
				},
				(err) => {
					onFailure(err);
					return false;
				},
			);
		}),
	);
};
export const syncCachedRepoIssueComments = async (
	onFailure: (err: any) => void,
) => {
	const cachedIssues = await getCachedIssues();
	return await Promise.all(
		cachedIssues.map(async (issue) => {
			return await getRepoIssueComment(
				issue.repo_full_name,
				issue.issue_number,
				issue.id,
			).then(
				(res) => {
					updateCachedRepoIssueComments(res);
					return true;
				},
				(err) => {
					onFailure(err);
					return false;
				},
			);
		}),
	);
};
