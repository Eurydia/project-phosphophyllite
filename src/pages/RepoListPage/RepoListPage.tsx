import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { RepoDataTable } from "~components/RepoDataTable";
import { HomeNavView } from "~views/HomeNavView";
import { LoaderData } from "./loader";

export const RepoListPage: FC = () => {
	const {
		repos,
		topicOptions,
		topics,
		name,
		visibility,
		status,
		topicMatchStrategy,
		properties,
	} = useLoaderData() as LoaderData;

	return (
		<HomeNavView tab={1}>
			<RepoDataTable
				topicOptions={topicOptions}
				repos={repos}
				topics={topics}
				name={name}
				visibility={visibility}
				status={status}
				topicMatchStrategy={topicMatchStrategy}
				properties={properties}
			/>
		</HomeNavView>
	);
};
