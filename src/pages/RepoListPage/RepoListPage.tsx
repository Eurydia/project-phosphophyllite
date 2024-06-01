import { SearchRounded } from "@mui/icons-material";
import {
	Box,
	Stack,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { useRepoQuery } from "hooks/useRepoQuery";
import { useRepoQueryOptions } from "hooks/useRepoQueryOptions";
import { FC } from "react";
import {
	Form,
	useLoaderData,
} from "react-router-dom";
import { RepoCard } from "~components/RepoCard";
import { StyledIconButton } from "~components/StyledIconButton";
import { StyledSelect } from "~components/StyledSelect";
import { StyledTextField } from "~components/StyledTextField";
import { LoaderData } from "./loader";

export const RepoListPage: FC = () => {
	const { repos, query: initQuery } =
		useLoaderData() as LoaderData;
	const theme = useTheme();
	const match = useMediaQuery(
		theme.breakpoints.down("md"),
	);
	const {
		query,
		setName,
		setStatus,
		setVisibility,
	} = useRepoQuery(initQuery);
	const { statusOptions, visibilityOptions } =
		useRepoQueryOptions();

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
		<Box
			display="flex"
			flexDirection="row"
			height="100%"
		>
			<Box
				padding={2}
				flexBasis={0}
				flexGrow={1}
			>
				<Form replace>
					<Stack
						spacing={1}
						alignItems="start"
					>
						<StyledTextField
							name="name"
							placeholder="Search repository"
							value={query.name}
							onChange={setName}
						/>
						<StyledSelect
							name="visibility"
							label="Visibility"
							value={query.visibility}
							onChange={setVisibility}
							options={visibilityOptions}
						/>
						<StyledSelect
							name="status"
							label="Status"
							value={query.status}
							onChange={setStatus}
							options={statusOptions}
						/>
						<StyledIconButton type="submit">
							<SearchRounded />
						</StyledIconButton>
					</Stack>
				</Form>
			</Box>
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
		</Box>
	);
};
