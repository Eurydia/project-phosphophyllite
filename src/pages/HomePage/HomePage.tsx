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
				minWidth: "175px",
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

	const closedIssuesSubheader =
		closedIssues === 1
			? "Closed issue"
			: "Closed issues";
	const openIssuesSubheader =
		openIssues === 1
			? "Open issue"
			: "Open issues";
	const activeReposSubheader =
		activeRepos === 1
			? "Active repository"
			: "Active repositories";
	const archivedReposSubheader =
		archivedRepos === 1
			? "Archived repository"
			: "Archived repositories";

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
					fontSize="x-large"
					fontWeight="bold"
				>
					Recent repositories
				</Typography>
				<RepoDataTable
					disableFilter
					repos={recentRepos}
					orderBy="pushed_at"
				/>
				<Typography
					fontSize="x-large"
					fontWeight="bold"
				>
					Recent issues
				</Typography>
				<IssueDataTable
					disableFilter
					issues={recentIssues}
					orderBy="updated_at"
				/>
			</Stack>
		</MainView>
	);
};
