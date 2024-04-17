import { Box } from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { IssueDataTable } from "~components/IssueDataTable";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { WithAppBar } from "~views/WithAppBar";
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
		<WithAppBar
			location={
				<StyledBreadcrumbs
					paths="~/issues"
					breadcrumbsProps={{
						sx: { flexGrow: 1 },
					}}
				/>
			}
		>
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
		</WithAppBar>
	);
};
