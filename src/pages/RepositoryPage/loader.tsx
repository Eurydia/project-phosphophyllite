import { LoaderFunction } from "react-router";
import {
	getIssuesInRepository,
	getRepositoryWithFullName,
} from "~database/get";
import {
	AppIssue,
	AppRepository,
} from "~types/models";

export type RepositoryPageLoaderData = {
	repository: AppRepository;
	issues: AppIssue[];
};
export const loaderRepositoryPage: LoaderFunction =
	async ({ params }) => {
		const { ownerName, repoName } = params;
		if (
			ownerName === undefined ||
			repoName === undefined
		) {
			throw new Response("", {
				status: 400,
				statusText: "Bad requeset",
			});
		}
		const fullName = `${ownerName}/${repoName}`;
		const repository =
			await getRepositoryWithFullName(fullName);

		if (repository === null) {
			throw new Response("", {
				status: 404,
				statusText: "Repository not found",
			});
		}
		const issues = await getIssuesInRepository(
			repository.url,
		);

		const data: RepositoryPageLoaderData = {
			repository,
			issues,
		};
		return data;
	};
