import {
	ExpandMoreRounded,
	SyncRounded,
} from "@mui/icons-material";
import { Button, Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { RequestError } from "octokit";
import { FC, useState } from "react";
import {
	useLoaderData,
	useSubmit,
} from "react-router-dom";
import { PopperButton } from "~components/PopoverButton";
import { RepoList } from "~components/RepoList";
import { SortRuleMenu } from "~components/SortRuleMenu";
import { StyledAutocomplete } from "~components/StyledAutocomplete";
import { StyledTextField } from "~components/StyledTextField";
import { getRepos } from "~database/api";
import { syncCachedRepos } from "~database/cached";
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
	const handleTopicChange = (value: string[]) => {
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
	const handleSyncRepos = async () => {
		getRepos()
			.then((repos) => syncCachedRepos(repos))
			.then(() =>
				submit(
					{
						sort,
						topics,
					},
					{
						action: "/",
						method: "get",
					},
				),
			)
			.then(() =>
				enqueueSnackbar(
					"Synchronization successful.",
					{
						variant: "success",
					},
				),
			)
			.catch((r) => {
				const _r = r as RequestError;
				const msg = `${_r.status} ${_r.message}`;
				enqueueSnackbar(msg, {
					variant: "error",
				});
			});
	};

	return (
		<WithAppBar
			location="Repositories"
			seconadaryNav={
				<Button
					disableElevation
					size="small"
					variant="outlined"
					startIcon={<SyncRounded />}
					onClick={handleSyncRepos}
				>
					Sync
				</Button>
			}
		>
			<Grid
				padding={2}
				container
				spacing={2}
			>
				<Grid
					item
					md={2}
				>
					<PopperButton
						buttonProps={{
							fullWidth: true,
							children: "sort",
							variant: "outlined",
							startIcon: <ExpandMoreRounded />,
						}}
					>
						<SortRuleMenu
							options={sortRules}
							value={sort}
							onChange={handleSortChange}
						/>
					</PopperButton>
				</Grid>
				<Grid
					item
					md={10}
				/>
				<Grid
					item
					md={4}
				>
					<StyledTextField
						label="Name"
						fullWidth
						value={name}
						onEnter={handleFilterSubmit}
						onChange={setName}
					/>
				</Grid>
				<Grid
					item
					md={6}
				>
					<StyledAutocomplete
						options={topicOptions}
						value={topics}
						onChange={handleTopicChange}
						textFieldProps={{
							label: "Topics",
						}}
					/>
				</Grid>
				<Grid
					item
					md={12}
				>
					<RepoList repos={repos} />
				</Grid>
			</Grid>
		</WithAppBar>
	);
};
