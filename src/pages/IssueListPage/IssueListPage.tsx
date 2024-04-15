import { Box } from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { IssueDataTable } from "~components/IssueDataTable";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData } from "./loader";

export const IssueListPage: FC = () => {
	const { issues, repoOptions } =
		useLoaderData() as LoaderData;

	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs paths="~/issues" />
			}
		>
			<Box
				paddingTop={2}
				paddingX={2}
			>
				<IssueDataTable
					issues={issues}
					repoOptions={repoOptions}
				/>
			</Box>
		</WithAppBar>
	);
};
