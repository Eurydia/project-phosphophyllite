import { invoke } from "@tauri-apps/api";
import { SelectOption } from "~types/generic";
import {
	Repository,
	REPOSITORY_SCHEMA,
} from "~types/schema";
import { dbPromise } from "./migration";

export const getRepositories = async () => {
	const items: unknown[] = await invoke(
		"get_repositories",
	);
	return checked as Repository[];
};

export const getRepositoryWithFullName = async (
	fullName: string,
) => {
	const item: unknown = await invoke(
		"get_repository_with_full_name",
		{ fullName },
	);
	return checked.data;
};

export const getIssues = async () => {
	const items: unknown[] = await invoke(
		"get_issues",
	);
	return items;
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
			(item) => item.repoFullName === fullName,
		);
	}
	if (issueNumber !== undefined) {
		issues = issues.filter(
			(item) => item.issueNumber === issueNumber,
		);
	}
	return issues;
};

// export const getCachedComments = async (
// 	issueId: number,
// ) => {
// 	return (await dbPromise).getAllFromIndex(
// 		"issueComments",
// 		"by-issueId",
// 		issueId,
// 	);
// };

// export const updateCachedRepos = async () => {
// 	const repos = await getRepos();
// 	const db = await dbPromise;
// 	const txReqs = repos.map((repo) =>
// 		db.put("repos", repo),
// 	);
// 	await Promise.all(txReqs);
// };
// export const updateCachedIssues = async () => {
// 	const cachedRepos = await getCachedRepos();
// 	const issueReqs = cachedRepos.map((repo) =>
// 		getIssues(repo.fullName, repo.id),
// 	);
// 	const issues = await Promise.all(issueReqs);
// 	const db = await dbPromise;
// 	const txReqs = issues
// 		.flat()
// 		.map((issue) => db.put("issues", issue));
// 	await Promise.all(txReqs);
// };

// export const updateCachedComments = async () => {
// 	const cachedIssues = await getCachedIssues();
// 	const commentReqs = cachedIssues.map((issue) =>
// 		getComments(
// 			issue.repoFullName,
// 			issue.issueNumber,
// 			issue.id,
// 		),
// 	);
// 	const comments = await Promise.all(commentReqs);

// 	const db = await dbPromise;
// 	const txReqs = comments
// 		.flat()
// 		.map((comment) =>
// 			db.put("issueComments", comment),
// 		);
// 	await Promise.all(txReqs);
// };

// export const getRepoOptions = async () => {
// 	const repos = await getCachedRepos();
// 	const repoNames = repos
// 		.map((repo) => repo.fullName)
// 		.sort();
// 	const options: SelectOption<string>[] =
// 		repoNames.map((name) => ({
// 			label: name,
// 			value: name,
// 		}));
// 	return options;
// };
