import { LoaderFunction } from "react-router";
import { getRepo } from "~database/api";
import { getCachedRepo } from "~database/cached";
import { RepoSchema } from "~types/schemas";

export type LoaderData = {
	repo: RepoSchema;
};
export const loaderProjectInfo: LoaderFunction =
	async ({ params }) => {
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
		let repo =
			(await getCachedRepo(fullName)) ||
			(await getRepo(fullName));
		if (repo === undefined) {
			throw new Response("Not found", {
				status: 404,
				statusText: "Repository not found",
			});
		}
		document.title = repo.name;
		const loaderData: LoaderData = {
			repo,
		};
		return loaderData;
	};
