import {
	Card,
	CardActionArea,
	CardHeader,
	Stack,
} from "@mui/material";
import { FC, ReactNode } from "react";
import { useLoaderData } from "react-router";
import { useSubmit } from "react-router-dom";
import { HomeNavView } from "~views/HomeNavView";
import { LoaderData } from "./loader";

type OverviewCardProps = {
	title: ReactNode;
	subheader: ReactNode;
	target: string;
	query: string;
};
const OverviewCard: FC<OverviewCardProps> = (
	props,
) => {
	const { title, subheader, target, query } =
		props;
	const submit = useSubmit();
	const handleClick = () => {
		submit(query, {
			action: target,
			method: "get",
		});
	};
	return (
		<Card
			square
			variant="outlined"
			sx={{ flexGrow: 1 }}
		>
			<CardActionArea
				disableTouchRipple
				onClick={handleClick}
			>
				<CardHeader
					title={title}
					subheader={subheader}
					titleTypographyProps={{
						color: ({ palette }) =>
							palette.secondary.main,
					}}
				/>
			</CardActionArea>
		</Card>
	);
};

export const HomePage: FC = () => {
	const {
		recentIssues,
		activeRepos,
		archivedRepos,
		closedIssues,
		openIssues,
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
		<HomeNavView tab={0}>
			<Stack
				useFlexGap
				spacing={2}
				direction="row"
				flexWrap="wrap"
			>
				<OverviewCard
					query="status=Active"
					target="/Repositories"
					title={activeRepos}
					subheader={activeReposSubheader}
				/>
				<OverviewCard
					query="status=Archived"
					target="/Repositories"
					title={archivedRepos}
					subheader={archivedReposSubheader}
				/>
				<OverviewCard
					query="status=Open"
					target="/Issues"
					title={openIssues}
					subheader={openIssuesSubheader}
				/>
				<OverviewCard
					query="status=Closed"
					target="/Issues"
					title={closedIssues}
					subheader={closedIssuesSubheader}
				/>
			</Stack>
		</HomeNavView>
	);
};
