import {
	Grid,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { PaddedPaper } from "~components/PaddedPaper";
import { RepoCard } from "~components/RepoCard";
import { RepoQueryForm } from "~components/RepoQueryForm";
import { FlexColumnLayout } from "~layouts/DualColumnLayout";
import { LoaderData } from "./loader";

export const RepoListPage: FC = () => {
	const { repos, query } =
		useLoaderData() as LoaderData;
	const { breakpoints } = useTheme();
	const single = useMediaQuery(
		breakpoints.down("md"),
	);
	const count = repos.length;
	const itemCountMsg =
		count === 1
			? `Showing 1 repositiory`
			: `Showing ${count} repositories`;
	const formElement = (
		<PaddedPaper
			square
			variant="outlined"
		>
			<RepoQueryForm initQuery={query} />
			<Typography>{itemCountMsg}</Typography>
		</PaddedPaper>
	);
	const items = repos.map((repo, index) => (
		<RepoCard
			key={`item-${index}`}
			repo={repo}
		/>
	));
	return (
		<Grid
			padding={2}
			container
			columns={12}
			spacing={2}
		>
			<Grid
				item
				xs={12}
				md={3}
			>
				{formElement}
			</Grid>
			<Grid
				item
				xs={12}
				md={9}
			>
				<FlexColumnLayout
					items={items}
					single={single}
				/>
			</Grid>
		</Grid>
	);
};
