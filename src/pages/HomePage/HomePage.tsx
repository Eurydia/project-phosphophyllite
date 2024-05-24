import {
	Box,
	Card,
	CardHeader,
	Stack,
	Typography,
} from "@mui/material";
import { FC, ReactNode } from "react";
import { useLoaderData } from "react-router";
import { IssueDataTable } from "~components/IssueDataTable";
import { RepoDataTable } from "~components/RepoDataTable";
import { MainView } from "~views/MainView";
import { LoaderData } from "./loader";

type OverviewCardProps = {
	title: ReactNode;
	subheader: ReactNode;
};
const OverviewCard: FC<OverviewCardProps> = (
	props,
) => {
	const { title, subheader } = props;
	return (
		<Card
			square
			variant="outlined"
			sx={{
				minWidth: "150px",
				flexGrow: 1,
			}}
		>
			<CardHeader
				title={title}
				subheader={subheader}
				titleTypographyProps={{
					color: "secondary",
					fontWeight: "900",
				}}
			/>
		</Card>
	);
};

export const HomePage: FC = () => {
	const {
		activeRepos,
		archivedRepos,
		closedIssues,
		openIssues,
		recentRepos,
		recentIssues,
	} = useLoaderData() as LoaderData;

	const openIssuesSubheader =
		closedIssues > 1
			? "Closed issues"
			: "Closed issue";
	const closedIssuesSubheader =
		openIssues > 1 ? "Open issues" : "Open issue";
	const activeReposSubheader =
		activeRepos > 1
			? "Active repositories"
			: "Active repositoriy";
	const archivedReposSubheader =
		archivedRepos > 1
			? "Archived repositories"
			: "Archived repositoriy";

	return (
		<MainView location="~">
			<Stack
				spacing={2}
				padding={2}
			>
				<Box
					sx={{
						gap: 1,
						display: "flex",
						flexWrap: "wrap",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<OverviewCard
						title={activeRepos}
						subheader={activeReposSubheader}
					/>
					<OverviewCard
						title={archivedRepos}
						subheader={archivedReposSubheader}
					/>
					<OverviewCard
						title={openIssues}
						subheader={openIssuesSubheader}
					/>
					<OverviewCard
						title={closedIssues}
						subheader={closedIssuesSubheader}
					/>
				</Box>
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
		</MainView>
	);
};
