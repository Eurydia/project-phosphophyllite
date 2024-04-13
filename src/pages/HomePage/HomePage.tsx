import {
	Button,
	Grid,
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

export const HomePage: FC = () => {
	const {
		name: loadedName,
		repos,
		topics,
		topicOptions,
	} = useLoaderData() as LoaderData;

	const { enqueueSnackbar } = useSnackbar();
	const submit = useSubmit();
	const [name, setName] = useState(loadedName);

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
			(res) => {
				syncCachedRepos(res);
				enqueueSnackbar({
					message: "Synced repositories",
					variant: "success",
				});
			},
			(err) =>
				enqueueSnackbar(err, {
					variant: "error",
				}),
		);
		const cachedRepos = await getCachedRepos();
		await Promise.all(
			cachedRepos.map(async (repo) => {
				getRepoIssues(
					repo.full_name,
					repo.id,
				).then(
					(res) => {
						syncCachedRepoIssues(res);
						enqueueSnackbar({
							message: "Synced issues",
							variant: "success",
						});
					},
					(err) =>
						enqueueSnackbar(err, {
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
					(res) => {
						syncRepoIssueComments(res);
						enqueueSnackbar({
							message: "Synced comments",
							variant: "success",
						});
					},
					(err) =>
						enqueueSnackbar(err, {
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
					onClick={handleSync}
				>
					Sync
				</Button>
			}
		>
			<Grid
				container
				spacing={2}
				paddingTop={2}
				paddingLeft={2}
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
