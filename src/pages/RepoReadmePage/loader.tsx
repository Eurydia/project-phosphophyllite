import { LoaderFunction } from "react-router";
import { getRepositoryWithFullName } from "~database/get";
import { AppRepository } from "~types/models";

export type LoaderData = {
	repository: AppRepository;
};
export const loader: LoaderFunction = async ({
	params,
}) => {
	const owner = params.owner;
	const repoName = params.repo;
	if (
		owner === undefined ||
		repoName === undefined
	) {
		throw new Response("", {
			status: 400,
			statusText: "Bad requeset",
		});
	}
	const fullName = `${owner}/${repoName}`;
	const repository =
		await getRepositoryWithFullName(fullName);
	if (repository === undefined) {
		throw new Response("Not found", {
			status: 404,
			statusText: "Repository not found in cache",
		});
	}
	console.log("Repository", fullName);
	const data: LoaderData = {
		repository,
	};
	return data;
};
