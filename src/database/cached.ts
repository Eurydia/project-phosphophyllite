import { dbPromise } from "~database/migration";
import {
	FileContentSchema,
	RepositorySchema,
} from "~types/schemas";

export const getCachedRepos = async () => {
	const data = (await dbPromise).getAll(
		"repositories",
	);
	return data;
};

export const getCachedRepo = async (
	fullName: string,
) => {
	return (await dbPromise).get(
		"repositories",
		fullName,
	);
};

export const getCachedReadme = async (
	repoFullName: string,
) => {
	return (await dbPromise).get(
		"readmes",
		repoFullName,
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

export const syncCachedRepos = async (
	repos: RepositorySchema[],
) => {
	const db = await dbPromise;
	return await Promise.all(
		repos.map((repo) =>
			db.put("repositories", repo),
		),
	);
};

export const syncCachedReadme = async (
	readme: FileContentSchema,
) => {
	return (await dbPromise).put("readmes", readme);
};
