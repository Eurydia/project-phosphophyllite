import { Box } from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { IssueDataTable } from "~components/IssueDataTable";
import { MainView } from "~views/MainView";
import { LoaderData } from "./loader";

export const IssueListPage: FC = () => {
	const {
		issues,
		repoOptions,
		title,
		ownerType,
		repoFullNames,
		state,
	} = useLoaderData() as LoaderData;

	return (
		<MainView location="~/Issues">
			<Box
				paddingTop={2}
				paddingX={2}
			>
				<IssueDataTable
					issues={issues}
					repoOptions={repoOptions}
					title={title}
					ownerType={ownerType}
					repoFullNames={repoFullNames}
					state={state}
				/>
			</Box>
		</MainView>
	);
};
