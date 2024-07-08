import { Grid } from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { RepoCard } from "~components/RepoCard";
import { DualColumnLayout } from "~layouts/DualColumnLayout";
import { LoaderData } from "./loader";

export const RepoListPage: FC = () => {
	const { repos, query } =
		useLoaderData() as LoaderData;
	const items = repos.map((repo, index) => (
		<RepoCard
			key={`item-${index}`}
			repo={repo}
		/>
	));
	const overflow = !single ? "auto" : undefined;
	return (
		<Grid
			container
			paddingTop={2}
			paddingLeft={2}
			columns={12}
			spacing={2}
			height="100%"
		>
			<Grid
				item
				xs={12}
				md={9}
				height="100%"
				paddingRight={2}
				overflow={overflow}
			>
				<DualColumnLayout
					items={items}
					single={single}
				/>
			</Grid>
		</Grid>
	);
};
