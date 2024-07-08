import { LoaderFunction } from "react-router";
import { getRepositories } from "~database/get";
import { AppRepository } from "~types/models";
export type HomePageLoaderData = {
	repositories: AppRepository[];
};

export const homePageLoader: LoaderFunction =
	async () => {
		const repositories = await getRepositories();
		const data: HomePageLoaderData = {
			repositories,
		};
		return data;
	};
