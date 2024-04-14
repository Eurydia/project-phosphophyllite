import {
	ClearRounded,
	FilterListRounded,
} from "@mui/icons-material";
import {
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	SelectChangeEvent,
	Toolbar,
	Typography,
} from "@mui/material";
import {
	FILTER_MODE_OPTIONS,
	FILTER_STATUS_OPTIONS,
	FILTER_VISIBILITY_OPTIONS,
} from "constants/filterOptions";
import { FC, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { RepoDataTable } from "~components/RepoDataTable";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { StyledSelect } from "~components/StyledSelect";
import { StyledSelectMultiple } from "~components/StyledSelectMultiple";
import { StyledTextField } from "~components/StyledTextField";
import {
	getRepoFilterName,
	getRepoFilterStatus,
	getRepoFilterTopicMode,
	getRepoFilterTopics,
	getRepoFilterVisibility,
} from "~database/preferences";
import { WithAppBar } from "~views/WithAppBar";
import { filterRepos } from "./helper";
import { LoaderData } from "./loader";

export const RepoListPage: FC = () => {
	const { repos, topicOptions } =
		useLoaderData() as LoaderData;

	const [filteredRepos, setFilteredRepos] =
		useState([...repos]);
	const [filterName, setFilterName] = useState(
		getRepoFilterName(),
	);
	const [filterTopics, setFilterTopics] =
		useState(getRepoFilterTopics());
	const [filterMode, setFilterMode] = useState(
		getRepoFilterTopicMode(),
	);
	const [filterVisibility, setFilterVisibility] =
		useState(getRepoFilterVisibility());
	const [filterStatus, setFilterStatus] =
		useState(getRepoFilterStatus());

	const [drawerOpen, setDrawerOpen] =
		useState(false);

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};
	const closeDrawer = () => {
		setDrawerOpen(false);
	};

	const handleFilterTopicChange = (
		event: SelectChangeEvent<string[]>,
	) => {
		const value = event.target.value
			.toString()
			.normalize();
		setFilterTopics(
			value
				.split(",")
				.filter((value_) => Boolean(value_)),
		);
	};
	const handleFilterTopicClear = () => {
		setFilterTopics([]);
	};
	const handleFilterCommit = () => {
		setFilteredRepos(
			filterRepos(
				repos,
				filterName,
				filterTopics,
				filterVisibility,
				filterStatus,
				filterMode,
			),
		);
	};

	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs paths="~/Repositories" />
			}
			seconadaryAction={
				<IconButton
					size="small"
					onClick={toggleDrawer}
				>
					<FilterListRounded />
				</IconButton>
			}
		>
			<Box
				paddingTop={2}
				paddingX={2}
			>
				<RepoDataTable repos={filteredRepos} />
			</Box>
			<Drawer
				elevation={0}
				anchor="right"
				variant="temporary"
				open={drawerOpen}
				onClose={closeDrawer}
				PaperProps={{
					sx: {
						width: "max(250px, 30vw)",
					},
				}}
			>
				<Toolbar
					variant="dense"
					sx={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Typography fontWeight="bold">
						Filter
					</Typography>
					<IconButton
						size="small"
						onClick={closeDrawer}
					>
						<ClearRounded />
					</IconButton>
				</Toolbar>
				<Divider
					flexItem
					variant="fullWidth"
				/>
				<List>
					<ListItem>
						<StyledTextField
							autoComplete="off"
							fullWidth
							placeholder="Search repository"
							size="small"
							value={filterName}
							onEnter={handleFilterCommit}
							onChange={setFilterName}
						/>
					</ListItem>
					<ListItem>
						<StyledSelectMultiple
							fullWidth
							displayEmpty
							subheader="Topics"
							renderValue={(value) =>
								`${value.length} selected`
							}
							size="small"
							value={filterTopics}
							options={topicOptions}
							onChange={handleFilterTopicChange}
						/>
						<IconButton
							size="small"
							onClick={handleFilterTopicClear}
						>
							<ClearRounded />
						</IconButton>
					</ListItem>
					<ListItem>
						<ListItemText>
							Match strategy
						</ListItemText>
						<ListItemSecondaryAction>
							<StyledSelect
								fullWidth
								displayEmpty
								subheader="Match strategy"
								size="small"
								value={filterMode}
								options={FILTER_MODE_OPTIONS}
								onChange={(e) =>
									setFilterMode(e.target.value)
								}
							/>
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem>
						<ListItemText>
							Visibility
						</ListItemText>
						<ListItemSecondaryAction>
							<StyledSelect
								displayEmpty
								subheader="Visibility"
								size="small"
								value={filterVisibility}
								options={
									FILTER_VISIBILITY_OPTIONS
								}
								onChange={(e) =>
									setFilterVisibility(
										e.target.value,
									)
								}
							/>
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem>
						<ListItemText>Status</ListItemText>
						<ListItemSecondaryAction>
							<StyledSelect
								displayEmpty
								subheader="Status"
								size="small"
								value={filterStatus}
								options={FILTER_STATUS_OPTIONS}
								onChange={(e) =>
									setFilterStatus(e.target.value)
								}
							/>
						</ListItemSecondaryAction>
					</ListItem>
					<ListItem>
						<Button
							disableElevation
							variant="contained"
							size="small"
							onClick={handleFilterCommit}
						>
							Filter
						</Button>
					</ListItem>
				</List>
			</Drawer>
		</WithAppBar>
	);
};
