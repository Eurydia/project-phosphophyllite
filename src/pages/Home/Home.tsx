import { SyncRounded } from "@mui/icons-material";
import {
	Button,
	Grid,
	ListSubheader,
	MenuItem,
	Select,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { RequestError } from "octokit";
import { FC, useState } from "react";
import {
	useLoaderData,
	useSubmit,
} from "react-router-dom";
import { RepoList } from "~components/RepoList";
import { StyledTextField } from "~components/StyledTextField";
import {
	getRepoIssueComment,
	getRepoIssues,
	getRepos,
} from "~database/api";
import {
	getCachedIssues,
	getCachedRepos,
	syncCachedRepoIssues,
	syncCachedRepos,
	syncRepoIssueComments,
} from "~database/cached";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData, sortRules } from "./loader";

export const Home: FC = () => {
	const {
		name: loadedName,
		repos,
		sort,
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
				sort,
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
				sort,
				topics: value,
			},
			{
				action: "/",
				method: "get",
			},
		);
	};
	const handleSync = async () => {
		const repos = await getRepos()
			.then((repos) => syncCachedRepos(repos))
			.catch((r) => {
				const _r = r as RequestError;
				const msg = `${_r.status} ${_r.message}`;
				enqueueSnackbar(msg, {
					variant: "error",
				});
				return null;
			});
		if (repos === null) {
			return;
		}
		const cachedRepos = await getCachedRepos();
		for (const repo of cachedRepos) {
			const issues = await getRepoIssues(
				repo.full_name,
				repo.id,
			)
				.then((issues) =>
					syncCachedRepoIssues(issues),
				)
				.catch((r) => {
					const _r = r as RequestError;
					const msg = `${_r.status} ${_r.message}`;
					enqueueSnackbar(msg, {
						variant: "error",
					});
					return null;
				});
			if (issues === null) {
				continue;
			}
			const cachedIssues = await getCachedIssues(
				repo.id,
			);
			for (const issue of cachedIssues) {
				await getRepoIssueComment(
					repo.full_name,
					issue.issue_number,
					issue.id,
				)
					.then((comments) =>
						syncRepoIssueComments(comments),
					)
					.catch((r) => {
						const _r = r as RequestError;
						const msg = `${_r.status} ${_r.message}`;
						enqueueSnackbar(msg, {
							variant: "error",
						});
						return null;
					});
			}
		}
		submit(
			{
				sort,
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

	return (
		<WithAppBar
			location="Repositories"
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
					md={6}
				>
					<StyledTextField
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
					<Select
						fullWidth
						displayEmpty
						renderValue={() => "Sort"}
						size="small"
						value={sort}
						onChange={(e) =>
							handleSortChange(e.target.value)
						}
					>
						<ListSubheader disableSticky>
							Select order
						</ListSubheader>
						{sortRules.map(({ value, label }) => (
							<MenuItem
								key={value}
								disableRipple
								value={value}
							>
								{label}
							</MenuItem>
						))}
					</Select>
				</Grid>
				<Grid
					item
					xs={4}
					md={2}
				>
					<Select
						multiple
						fullWidth
						displayEmpty
						renderValue={() => "Topics"}
						size="small"
						value={topics}
						onChange={(e) =>
							handleTopicChange(e.target.value)
						}
					>
						<ListSubheader disableSticky>
							Select topics
						</ListSubheader>
						{topicOptions.map((option) => (
							<MenuItem
								key={option}
								value={option}
							>
								{option}
							</MenuItem>
						))}
					</Select>
				</Grid>
				<Grid
					item
					xs={12}
				>
					<RepoList repos={repos} />
				</Grid>
			</Grid>
		</WithAppBar>
	);
};
