import {
	ChevronLeftRounded,
	ClearRounded,
} from "@mui/icons-material";
import {
	Box,
	Container,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Stack,
	Tab,
	Tabs,
	Toolbar,
	Typography,
} from "@mui/material";
import { Buffer } from "buffer";
import { FC, useState } from "react";
import { useLoaderData } from "react-router";
import { IssueDataTable } from "~components/IssueDataTable";
import { Markdown } from "~components/Markdown";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData } from "./loader";

import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { toSearchParam } from "~core/query";
import { toTimeStamp } from "~core/time";
import { RepoSchema } from "~types/schemas";

const REPO_METADATA_DEFINITIONS: {
	label: string;
	render: (repo: RepoSchema) => ReactNode;
}[] = [
	{
		label: "Description",
		render: (repo) =>
			repo.description ?? "No description",
	},
	{
		label: "Last pushed",
		render: (repo) =>
			repo.pushed_at
				? toTimeStamp(repo.pushed_at)
				: "Never",
	},
	{
		label: "Last updated",
		render: (repo) =>
			repo.updated_at
				? toTimeStamp(repo.updated_at)
				: "Never",
	},
	{
		label: "Created",
		render: (repo) =>
			repo.created_at
				? toTimeStamp(repo.created_at)
				: "Unknown",
	},
	{
		label: "Visibility",
		render: (repo) =>
			repo.is_private ? "Private" : "Public",
	},
	{
		label: "Status",
		render: (repo) =>
			repo.is_private ? "Archived" : "Active",
	},
	{
		label: "Links",
		render: (repo) => (
			<Stack
				component="span"
				flexDirection="row"
				flexWrap="wrap"
				gap={1}
			>
				<Typography
					component="a"
					href={repo.html_url}
					target="_blank"
				>
					GitHub repository
				</Typography>
				<Typography
					component="a"
					href={repo.homepage ?? undefined}
					target="_blank"
				>
					Homepage
				</Typography>
			</Stack>
		),
	},
	{
		label: "Topics",
		render: (repo) =>
			repo.topics && repo.topics.length > 0 ? (
				<Stack
					component="span"
					gap={1}
					flexDirection="row"
					flexWrap="wrap"
				>
					{repo.topics.map((topic) => (
						<Typography
							key={topic}
							component={Link}
							to={{
								pathname: "/repositories",
								search: toSearchParam({
									topics: topic,
								}),
							}}
						>
							{topic}
						</Typography>
					))}
				</Stack>
			) : (
				"No topic assigned"
			),
	},
];

export const RepoDetailsPage: FC = () => {
	const {
		repoOptions,
		repo,
		issues,
		title,
		ownerType,
		repoFullNames,
		state,
	} = useLoaderData() as LoaderData;

	const [tab, setTab] = useState(0);
	const [drawerOpen, setDrawerOpen] =
		useState(false);

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};
	const closeDrawer = () => {
		setDrawerOpen(false);
	};

	let decodedReadme: string | undefined;
	if (repo.readme !== undefined) {
		decodedReadme = Buffer.from(
			repo.readme,
			"base64",
		).toString();
	}

	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs
					paths={`~/repositories/${repo.full_name}`}
				/>
			}
			seconadaryAction={
				<IconButton
					onClick={toggleDrawer}
					size="small"
					disableRipple
				>
					<ChevronLeftRounded />
				</IconButton>
			}
		>
			<Toolbar
				disableGutters
				variant="dense"
			>
				<Tabs
					value={tab}
					onChange={(_, tab) => setTab(tab)}
				>
					<Tab
						value={0}
						label="Readme"
					/>
					<Tab
						value={1}
						label="Issues"
					/>
				</Tabs>
			</Toolbar>
			<Divider />
			{tab === 0 && (
				<Container maxWidth="sm">
					<Markdown
						emptyText="This repository does not contain a readme."
						markdownContent={decodedReadme}
					/>
				</Container>
			)}
			{tab === 1 && (
				<Box padding={2}>
					<IssueDataTable
						repoOptions={repoOptions}
						issues={issues}
						title={title}
						ownerType={ownerType}
						repoFullNames={repoFullNames}
						state={state}
					/>
				</Box>
			)}
			<Drawer
				elevation={0}
				anchor="right"
				variant="temporary"
				open={drawerOpen}
				onClose={closeDrawer}
				PaperProps={{
					sx: { width: "max(300px, 30vw)" },
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
						Metadata
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
				<List
					disablePadding
					dense
				>
					{REPO_METADATA_DEFINITIONS.map(
						({ label, render }) => (
							<ListItem key={label}>
								<ListItemText
									secondary={render(repo)}
								>
									{label}
								</ListItemText>
							</ListItem>
						),
					)}
				</List>
			</Drawer>
		</WithAppBar>
	);
};
