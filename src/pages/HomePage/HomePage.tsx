import {
	Card,
	CardHeader,
	Stack,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { IssueDataTable } from "~components/IssueDataTable";
import { RepoDataTable } from "~components/RepoDataTable";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData } from "./loader";

export const HomePage: FC = () => {
	const {
		activeRepos,
		archivedRepos,
		closedIssues,
		openIssues,
		recentRepos,
		recentIssues,
	} = useLoaderData() as LoaderData;
	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs
					path="~"
					breadcrumbsProps={{
						sx: { flexGrow: 1 },
					}}
				/>
			}
		>
			<Stack
				spacing={2}
				padding={4}
			>
				<Stack
					flexDirection="row"
					flexWrap="wrap"
					alignItems="center"
					gap={1}
				>
					<Card
						variant="outlined"
						sx={{ flexGrow: 1, minWidth: 250 }}
					>
						<CardHeader
							title={activeRepos}
							subheader={
								activeRepos > 1
									? "Active repositories"
									: "Active repositoriy"
							}
							titleTypographyProps={{
								color: "secondary",
							}}
						/>
					</Card>
					<Card
						variant="outlined"
						sx={{ flexGrow: 1, minWidth: 250 }}
					>
						<CardHeader
							title={archivedRepos}
							subheader={
								archivedRepos > 1
									? "Archived repositories"
									: "Archived repositoriy"
							}
							titleTypographyProps={{
								color: "secondary",
							}}
						/>
					</Card>
					<Card
						variant="outlined"
						sx={{ flexGrow: 1, minWidth: 250 }}
					>
						<CardHeader
							title={openIssues}
							subheader={
								openIssues > 1
									? "Open issues"
									: "Open issue"
							}
							titleTypographyProps={{
								color: "secondary",
							}}
						/>
					</Card>
					<Card
						variant="outlined"
						sx={{ flexGrow: 1, minWidth: 250 }}
					>
						<CardHeader
							title={closedIssues}
							subheader={
								closedIssues > 1
									? "Closed issues"
									: "Closed issue"
							}
							titleTypographyProps={{
								color: "secondary",
							}}
						/>
					</Card>
				</Stack>
				<Typography
					fontSize="large"
					fontWeight="bold"
				>
					Recent repositories
				</Typography>
				<RepoDataTable
					repos={recentRepos}
					orderBy="pushed_at"
					disableFilter
				/>
				<Typography
					fontSize="large"
					fontWeight="bold"
				>
					Recent issues
				</Typography>
				<IssueDataTable
					issues={recentIssues}
					orderBy="updated_at"
					disableFilter
				/>
			</Stack>
		</WithAppBar>
	);
};
