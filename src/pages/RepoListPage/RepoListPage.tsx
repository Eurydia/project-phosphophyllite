import {
	Box,
	Paper,
	Stack,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { RepoCard } from "~components/RepoCard";
import { RepoQueryForm } from "~components/RepoQueryForm";
import { LoaderData } from "./loader";

export const RepoListPage: FC = () => {
	const { repos, query } =
		useLoaderData() as LoaderData;
	const theme = useTheme();
	const match = useMediaQuery(
		theme.breakpoints.down("md"),
	);
	const count = repos.length;
	const itemCountMsg =
		count === 1
			? `Showing 1 repostiory`
			: `Showing ${count} repostiories`;

	if (match) {
		const items = repos.map((repo) => (
			<RepoCard
				key={repo.fullName}
				repo={repo}
			/>
		));
		return (
			<Stack
				padding={2}
				spacing={2}
			>
				<Paper
					square
					variant="outlined"
					sx={{
						padding: 2,
					}}
				>
					<RepoQueryForm initQuery={query} />
					<Typography>{itemCountMsg}</Typography>
				</Paper>
				{items}
			</Stack>
		);
	}

	const leftItems = repos
		.filter((_, i) => i % 2 === 0)
		.map((repo) => (
			<RepoCard
				key={repo.fullName}
				repo={repo}
			/>
		));
	const rightItems = repos
		.filter((_, i) => i % 2 === 1)
		.map((repo) => (
			<RepoCard
				key={repo.fullName}
				repo={repo}
			/>
		));
	return (
		<Stack
			height="100%"
			direction="row"
		>
			<Paper
				square
				variant="outlined"
				sx={{
					marginY: 2,
					marginLeft: 2,
					height: "fit-content",
					padding: 2,
					flexBasis: 0,
					flexGrow: 1,
				}}
			>
				<RepoQueryForm initQuery={query} />
				<Typography>{itemCountMsg}</Typography>
			</Paper>
			<Box
				padding={2}
				flexBasis={0}
				flexGrow={4}
				overflow="auto"
			>
				<Stack
					spacing={2}
					direction="row"
				>
					<Stack
						spacing={2}
						flexGrow={1}
						flexBasis={0}
					>
						{leftItems}
					</Stack>
					<Stack
						spacing={2}
						flexGrow={1}
						flexBasis={0}
					>
						{rightItems}
					</Stack>
				</Stack>
			</Box>
		</Stack>
	);
};
