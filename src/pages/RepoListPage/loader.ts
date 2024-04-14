import { LoaderFunction } from "react-router-dom";
import {
	getCachedRepos,
	getCachedTopics,
	getRepos,
} from "~database/index";
import { RepoSchema } from "~types/schemas";

export type LoaderData = {
	repos: RepoSchema[];
	topicOptions: {
		label: string;
		value: string;
	}[];
};
export const loader: LoaderFunction =
	async (): Promise<LoaderData> => {
		document.title = "Repositories";
		const topicOptions: {
			label: string;
			value: string;
		}[] = (await getCachedTopics()).map(
			(topic) => {
				return { label: topic, value: topic };
			},
		);
		const repos =
			(await getCachedRepos()) ||
			(await getRepos());

		return {
			topicOptions,
			repos,
		};
	};
