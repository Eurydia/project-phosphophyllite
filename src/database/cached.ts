import { dbPromise } from "~database/migration";
import {
	RepoIssueCommentSchema,
	RepoIssueSchema,
	RepoSchema,
} from "~types/schemas";

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

export const getCachedIssuesAll = async () => {
	return dbPromise.then((db) =>
		db.getAll("issues"),
	);
};

export const getCachedIssues = async (
	repoId: number,
) => {
	return (await dbPromise).getAllFromIndex(
		"issues",
		"by-repo_id",
		repoId,
	);
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

export const syncCachedRepos = async (
	repos: RepoSchema[],
) => {
	const db = await dbPromise;
	return await Promise.all(
		repos.map((repo) => db.put("repos", repo)),
	);
};

export const syncCachedRepoIssues = async (
	issues: RepoIssueSchema[],
) => {
	const db = await dbPromise;
	return await Promise.all(
		issues.map((issue) =>
			db.put("issues", issue),
		),
	);
};

export const syncRepoIssueComments = async (
	issueComments: RepoIssueCommentSchema[],
) => {
	const db = await dbPromise;
	return await Promise.all(
		issueComments.map((comment) =>
			db.put("issueComments", comment),
		),
	);
};
