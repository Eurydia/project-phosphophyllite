import {
	Stack,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { FC } from "react";
import { RepoCard } from "~components/RepoCard";
import { RepoSchema } from "~types/schema";

type LayoutProps = {
	repos: RepoSchema[];
};
export const Layout: FC<LayoutProps> = (
	props,
) => {
	const { repos } = props;
	const theme = useTheme();
	const match = useMediaQuery(
		theme.breakpoints.down("md"),
	);
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
				{items}
			</Stack>
		);
	}
};
