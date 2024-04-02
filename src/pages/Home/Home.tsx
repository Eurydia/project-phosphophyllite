import {
	ExpandMoreRounded,
	FilterListRounded,
	SyncRounded,
} from "@mui/icons-material";
import {
	Button,
	Stack,
	TextField,
} from "@mui/material";
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
import { getRepos } from "~database/api";
import { syncCachedRepos } from "~database/cached";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData, sortRules } from "./loader";

export const Home: FC = () => {
	const {
		name: loadedName,
		repos,
		sort,
		topics: loadedTopics,
		topicOptions,
	} = useLoaderData() as LoaderData;

	const { enqueueSnackbar } = useSnackbar();
	const submit = useSubmit();

	const [name, setName] = useState(loadedName);
	const [topics, setTopics] =
		useState(loadedTopics);

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
	const handleSyncRepos = async () => {
		getRepos()
			.then((repos) => {
				syncCachedRepos(repos);
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
			})
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
			<Stack
				spacing={2}
				padding={2}
			>
				<Stack
					spacing={1}
					direction="row"
				>
					<TextField
						size="small"
						label="Search"
						value={name}
						onChange={(event) =>
							setName(
								event.target.value
									.normalize()
									.trimEnd(),
							)
						}
						sx={{ width: "30%" }}
					/>
					<StyledAutocomplete
						width="30%"
						label="Topics"
						options={topicOptions}
						value={topics}
						onChange={setTopics}
					/>
					<Button
						variant="outlined"
						startIcon={<FilterListRounded />}
						onClick={handleFilterSubmit}
					>
						filter
					</Button>
					<PopperButton
						buttonProps={{
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
				</Stack>
				<RepoList repos={repos} />
			</Stack>
		</WithAppBar>
	);
};
