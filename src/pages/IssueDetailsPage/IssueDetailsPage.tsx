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
	Toolbar,
	Typography,
	capitalize,
} from "@mui/material";
import { FC, Fragment, useState } from "react";
import { useLoaderData } from "react-router";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData } from "./loader";

import { ReactNode } from "react";
import { Markdown } from "~components/Markdown";
import { toTimeStamp } from "~core/time";
import { RepoIssueSchema } from "~types/schemas";

const METADATA_DEFINITIONS: {
	label: string;
	render: (repo: RepoIssueSchema) => ReactNode;
}[] = [
	{
		label: "Title",
		render: (issue) => issue.title,
	},
	{
		label: "State",
		render: (issue) => capitalize(issue.state),
	},
	{
		label: "Owner type",
		render: (issue) =>
			issue.owner_type ?? "Unknown",
	},
	{
		label: "Last modified",
		render: (issue) =>
			issue.updated_at
				? toTimeStamp(issue.updated_at)
				: "Never",
	},
	{
		label: "Closed",
		render: (issue) =>
			issue.closed_at
				? toTimeStamp(issue.closed_at)
				: "Not closed",
	},
	{
		label: "Created",
		render: (issue) =>
			issue.created_at
				? toTimeStamp(issue.created_at)
				: "Unknown",
	},
	{
		label: "Links",
		render: (issue) => (
			<Typography
				component="a"
				href={issue.html_url}
				target="_blank"
			>
				Github issue
			</Typography>
		),
	},
];

export const IssueDetailsPage: FC = () => {
	const { issue, comments } =
		useLoaderData() as LoaderData;

	const [drawerOpen, setDrawerOpen] =
		useState(false);

	const toggleDrawer = () => {
		setDrawerOpen(!drawerOpen);
	};
	const closeDrawer = () => {
		setDrawerOpen(false);
	};

	return (
		<Fragment>
			<WithAppBar
				location={
					<StyledBreadcrumbs
						path={`~/repositories/${issue.repo_full_name}/issues/${issue.issue_number}`}
						breadcrumbsProps={{
							sx: {
								overflow: "auto",
								flexGrow: { xs: 0, sm: 1 },
							},
						}}
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
				<Container maxWidth="sm">
					<Stack
						spacing={2}
						padding={2}
						divider={
							<Divider
								flexItem
								variant="fullWidth"
							/>
						}
					>
						<Markdown
							markdownContent={
								issue.body ?? undefined
							}
							emptyText="This issue does not have a body or its body is not cached."
						/>
						{comments.map((comment, index) => (
							<Box key={`comment-${comment.id}`}>
								<Typography fontWeight="bold">
									Comment #{index + 1}
								</Typography>
								<Markdown
									markdownContent={
										comment.body ?? undefined
									}
									emptyText="This comment does not have a body or its body not is cached."
								/>
							</Box>
						))}
					</Stack>
				</Container>
			</WithAppBar>
			<Drawer
				elevation={0}
				anchor="right"
				variant="temporary"
				open={drawerOpen}
				onClose={closeDrawer}
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
					{METADATA_DEFINITIONS.map(
						({ label, render }) => (
							<ListItem key={label}>
								<ListItemText
									secondary={render(issue)}
								>
									{label}
								</ListItemText>
							</ListItem>
						),
					)}
				</List>
			</Drawer>
		</Fragment>
	);
};