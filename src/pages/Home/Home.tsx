import {
	FilterListOffRounded,
	SyncRounded,
} from "@mui/icons-material";
import {
	Button,
	Grid,
	IconButton,
	Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FC, useState } from "react";
import {
	useLoaderData,
	useSubmit,
} from "react-router-dom";
import { RepoDataTable } from "~components/RepoDataTable";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { StyledSelectMultiple } from "~components/StyledSelectMultiple";
import { StyledTextField } from "~components/StyledTextField";
import {
	getRepoIssueComment,
	getRepoIssues,
	getRepos,
} from "~database/api";
import {
	getCachedIssuesAll,
	getCachedRepos,
	syncCachedRepoIssues,
	syncCachedRepos,
	syncRepoIssueComments,
} from "~database/cached";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData } from "./loader";

export const Home: FC = () => {
	const {
		name: loadedName,
		repos,
		topics,
		topicOptions,
	} = useLoaderData() as LoaderData;

	const { enqueueSnackbar } = useSnackbar();
	const submit = useSubmit();
	const [name, setName] = useState(loadedName);

	const handleSortChange = (value: string) => {
		submit(
			{
				name,
				sort: value,
				topics,
			},
			{ action: "/", method: "get" },
		);
	};
	const handleFilterSubmit = () => {
		submit(
			{
				name,
				topics,
			},
			{
				action: "/",
				method: "get",
			},
		);
	};
	const handleTopicChange = (
		value: string[] | string,
	) => {
		submit(
			{
				name,
				topics: value,
			},
			{
				action: "/",
				method: "get",
			},
		);
	};
	const handleSync = async () => {
		await getRepos().then(
			(res) => syncCachedRepos(res),
			(err) => {
				enqueueSnackbar(err ?? "uhoh", {
					variant: "error",
				});
			},
		);
		const cachedRepos = await getCachedRepos();
		await Promise.all(
			cachedRepos.map(async (repo) => {
				getRepoIssues(
					repo.full_name,
					repo.id,
				).then(
					(res) => syncCachedRepoIssues(res),
					(err) =>
						enqueueSnackbar(err ?? "uhoh", {
							variant: "error",
						}),
				);
			}),
		);

		const cachedIssues =
			await getCachedIssuesAll();
		await Promise.all(
			cachedIssues.map(async (issue) => {
				getRepoIssueComment(
					issue.repo_full_name,
					issue.issue_number,
					issue.id,
				).then(
					(res) => syncRepoIssueComments(res),
					(err) =>
						enqueueSnackbar(err ?? "uhoh", {
							variant: "error",
						}),
				);
			}),
		);
		submit(
			{
				topics,
			},
			{
				action: "/",
				method: "get",
			},
		);
		enqueueSnackbar(
			"Synchronization successful.",
			{
				variant: "success",
			},
		);
	};

	const handleFilterClear = () => {
		submit({}, { action: "./", method: "get" });
	};

	return (
		<WithAppBar
			location={<StyledBreadcrumbs />}
			seconadaryAction={
				<Button
					disableElevation
					size="small"
					variant="outlined"
					startIcon={<SyncRounded />}
					onClick={handleSync}
				>
					Sync
				</Button>
			}
		>
			<Grid
				container
				padding={2}
				spacing={2}
			>
				<Grid
					item
					xs={12}
					md={7}
				>
					<StyledTextField
						autoComplete="off"
						fullWidth
						placeholder="Name"
						size="small"
						value={name}
						onEnter={handleFilterSubmit}
						onChange={setName}
					/>
				</Grid>

				<Grid
					item
					xs={4}
					md={2}
				>
					<StyledSelectMultiple
						fullWidth
						displayEmpty
						renderValue={() => "Topics"}
						size="small"
						value={topics}
						options={topicOptions.map((opt) => ({
							label: opt,
							value: opt,
						}))}
						onChange={(event) =>
							handleTopicChange(
								event.target.value,
							)
						}
					/>
				</Grid>
				<Grid
					item
					xs={1}
				>
					<IconButton
						title="Clear filter"
						onClick={handleFilterClear}
					>
						<FilterListOffRounded />
					</IconButton>
				</Grid>
				<Grid
					item
					xs={12}
				>
					<Typography
						variant="subtitle2"
						fontSize="small"
						fontWeight="bold"
					>
						Showing {repos.length} repositories
					</Typography>
				</Grid>
				<Grid
					item
					xs={12}
				>
					<RepoDataTable repos={repos} />
				</Grid>
			</Grid>
		</WithAppBar>
	);
};
