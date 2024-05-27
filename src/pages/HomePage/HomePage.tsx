import {
	Card,
	CardHeader,
	Stack,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import { FC, ReactNode } from "react";
import { useLoaderData } from "react-router";
import { useSubmit } from "react-router-dom";
import { IssueDataTable } from "~components/IssueDataTable";
import { RepoDataTable } from "~components/RepoDataTable";
import { MainView } from "~views/MainView";
import { TabNavView } from "~views/TabNavView";
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

	const submit = useSubmit();
	const handleTabChange = (
		_: React.SyntheticEvent<Element, Event>,
		value: number,
	) => {
		if (value === 0) {
			return;
		}
		const target =
			value === 1 ? "/Repositories" : "/Issues";
		submit(
			{},
			{
				action: target,
				method: "get",
			},
		);
	};

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
		<MainView>
			<TabNavView
				nav={
					<Tabs
						value={0}
						onChange={handleTabChange}
					>
						<Tab
							value={0}
							label="Overview"
						/>
						<Tab
							value={1}
							label="Repositories"
						/>
						<Tab
							value={2}
							label="Issues"
						/>
					</Tabs>
				}
			>
				<Stack
					spacing={2}
					padding={2}
				>
					<Stack
						direction="row"
						flexWrap="wrap"
						gap={1}
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
					</Stack>
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
			</TabNavView>
		</MainView>
	);
};
