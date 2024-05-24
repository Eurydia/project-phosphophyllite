import { Box } from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { RepoDataTable } from "~components/RepoDataTable";
import { MainView } from "~views/MainView";
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
		<MainView location="~/Repositories">
			<Box padding={2}>
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
			</Box>
		</MainView>
	);
};
