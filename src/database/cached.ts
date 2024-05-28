import { dbPromise } from "~database/migration";
import { SelectOption } from "~types/generics";
import {
	CommentSchema,
	IssueSchema,
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

const updateCachedRepos = async (
	repos: RepoSchema[],
) => {
	const db = await dbPromise;
	const req = repos.map((repo) =>
		db.put("repos", repo),
	);
	const res = await Promise.all(req);
	return res;
};

const updateCachedRepoIssues = async (
	issues: IssueSchema[],
) => {
	const db = await dbPromise;
	const req = issues.map((issue) =>
		db.put("issues", issue),
	);
	const res = await Promise.all(req);
	return res;
};

const updateCachedRepoIssueComments = async (
	issueComments: CommentSchema[],
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
