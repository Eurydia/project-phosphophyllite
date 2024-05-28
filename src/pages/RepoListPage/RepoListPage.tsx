import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { RepoDataTable } from "~components/RepoDataTable";
import { HomeNavView } from "~views/HomeNavView";
import { LoaderData } from "./loader";

export const RepoListPage: FC = () => {
	const { repos, topicOptions, query } =
		useLoaderData() as LoaderData;

	return (
		<HomeNavView tab={1}>
			<RepoDataTable
				topicOptions={topicOptions}
				repos={repos}
				query={query}
			/>
		</HomeNavView>
	);
};
