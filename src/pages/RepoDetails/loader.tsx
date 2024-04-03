import { LoaderFunction } from "react-router";
import { getRepoContentReadMe as getReadMe } from "~database/api";
import {
	getCachedReadme,
	getCachedRepo,
} from "~database/cached";
import { RepositorySchema } from "~types/schemas";

export type LoaderData = {
	readmeContent: string;
	repo: RepositorySchema;
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
		let repo = await getCachedRepo(fullName);
		if (repo === undefined) {
			throw new Response("Not found", {
				status: 404,
				statusText: "Repository not found",
			});
		}
		let readme =
			(await getCachedReadme(repo.full_name)) ||
			(await getReadMe(fullName));
		let readmeContent = "";
		if (
			readme !== undefined &&
			readme.content !== undefined &&
			readme.encoding !== undefined
		) {
			readmeContent = atob(readme.content);
		}
		document.title = repo.name;
		const loaderData: LoaderData = {
			repo,
			readmeContent,
		};
		return loaderData;
	};
