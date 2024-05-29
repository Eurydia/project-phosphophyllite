import { SelectOption } from "~types/generic";
import {
	getComments,
	getIssues,
	getRepos,
} from "./auth";
import { dbPromise } from "./migration";

export const getCachedRepos = async () => {
	return (await dbPromise).getAll("repos");
};

export const getCachedRepo = async (
	fullName: string,
) => {
	const db = await dbPromise;
	const repo = await db.getFromIndex(
		"repos",
		"by-full_name",
		fullName,
	);
	return repo;
};

export const getCachedIssues = async (
	fullName: string | undefined = undefined,
	issueNumber: number | undefined = undefined,
) => {
	const cachedIssues = await dbPromise.then(
		(db) => db.getAll("issues"),
	);
	let issues = [...cachedIssues];
	if (fullName !== undefined) {
		issues = issues.filter(
			(item) => item.repo_full_name === fullName,
		);
	}
	if (issueNumber !== undefined) {
		issues = issues.filter(
			(item) => item.issue_number === issueNumber,
		);
	}
	return issues;
};

export const getCachedComments = async (
	issueId: number,
) => {
	return (await dbPromise).getAllFromIndex(
		"issueComments",
		"by-issue_id",
		issueId,
	);
};

export const updateCachedRepos = async () => {
	const repos = await getRepos();
	const db = await dbPromise;
	const txReqs = repos.map((repo) =>
		db.put("repos", repo),
	);
	await Promise.all(txReqs);
};
export const updateCachedIssues = async () => {
	const cachedRepos = await getCachedRepos();
	const issueReqs = cachedRepos.map((repo) =>
		getIssues(repo.full_name, repo.id),
	);
	const issues = await Promise.all(issueReqs);
	const db = await dbPromise;
	const txReqs = issues
		.flat()
		.map((issue) => db.put("issues", issue));
	await Promise.all(txReqs);
};

export const updateCachedComments = async () => {
	const cachedIssues = await getCachedIssues();
	const commentReqs = cachedIssues.map((issue) =>
		getComments(
			issue.repo_full_name,
			issue.issue_number,
			issue.id,
		),
	);
	const comments = await Promise.all(commentReqs);

	const db = await dbPromise;
	const txReqs = comments
		.flat()
		.map((comment) =>
			db.put("issueComments", comment),
		);
	await Promise.all(txReqs);
};

export const getRepoOptions = async () => {
	const repos = await getCachedRepos();
	const repoNames = repos
		.map((repo) => repo.full_name)
		.sort();
	const options: SelectOption<string>[] =
		repoNames.map((name) => ({
			label: name,
			value: name,
		}));
	return options;
};

const getCachedTopics = async () => {
	const repos = await getCachedRepos();
	const cachedTopics = new Set<string>();
	for (const repo of repos) {
		if (repo.topics === undefined) {
			continue;
		}
		for (const topic of repo.topics) {
			cachedTopics.add(topic);
		}
	}
	const topics = [...cachedTopics];
	topics.sort();
	return topics;
};

export const getTopicOptions = async () => {
	const topics = await getCachedTopics();
	const topicOptions: SelectOption<string>[] =
		topics.map((topic) => ({
			label: topic,
			value: topic,
		}));
	return topicOptions;
};
