import { Box } from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { RepoDataTable } from "~components/RepoDataTable";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { WithAppBar } from "~views/WithAppBar";
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
	} = useLoaderData() as LoaderData;

	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs paths="~/repositories" />
			}
		>
			<Box padding={2}>
				<RepoDataTable
					topicOptions={topicOptions}
					repos={repos}
					topics={topics}
					name={name}
					visibility={visibility}
					status={status}
					topicMatchStrategy={topicMatchStrategy}
				/>
			</Box>
		</WithAppBar>
	);
};
