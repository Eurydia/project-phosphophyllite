import { LoaderFunction } from "react-router";
import { getRepositoryWithFullName } from "~tauri/db/get";
import { AppRepository } from "~types/models";

export type DescriptionEditPageLoaderData = {
	repository: AppRepository;
};

export const descriptionEditPageLoader: LoaderFunction =
	async ({ params }) => {
		const { repoName, ownerName } = params;
		if (
			repoName === undefined ||
			ownerName === undefined
		) {
			throw new Response("", {
				status: 400,
				statusText: "Bad request",
			});
		}

		const repository =
			await getRepositoryWithFullName(
				ownerName,
				repoName,
			);

		if (repository === null) {
			throw new Response("", {
				status: 404,
				statusText: "Repository not found",
			});
		}

		const data: DescriptionEditPageLoaderData = {
			repository,
		};
		return data;
	};