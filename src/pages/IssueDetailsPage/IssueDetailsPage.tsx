import {
	Box,
	Container,
	List,
	ListItem,
	ListItemText,
	SxProps,
	Theme,
	Typography,
	capitalize,
} from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData } from "./loader";

import { ReactNode } from "react";
import { Markdown } from "~components/Markdown";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import {
	normalizeDateString,
	toTimeStamp,
} from "~core/time";
import {
	RepoIssueCommentSchema,
	RepoIssueSchema,
} from "~types/schemas";

const METADATA_DEFINITIONS: {
	flexGrow: number;
	label: string;
	render: (repo: RepoIssueSchema) => ReactNode;
}[] = [
	{
		label: "Last updated",
		render: (issue) =>
			toTimeStamp(issue.updated_at, "Never"),
		flexGrow: 1,
	},
	{
		label: "Created",
		render: (issue) =>
			toTimeStamp(issue.created_at, "Unknown"),
		flexGrow: 1,
	},
	{
		label: "Closed",
		render: (issue) =>
			toTimeStamp(issue.closed_at, "Not closed"),
		flexGrow: 1,
	},
	{
		label: "State",
		render: (issue) => capitalize(issue.state),
		flexGrow: 0,
	},
	{
		label: "Owner type",
		render: (issue) =>
			issue.owner_type ?? "Unknown",
		flexGrow: 0,
	},
];

type IssueMetaDataListProps = {
	issue: RepoIssueSchema;
};
const IssueMetaData: FC<
	IssueMetaDataListProps
> = (props) => {
	const { issue } = props;
	return (
		<List
			dense
			disablePadding
			sx={{
				display: "flex",
				flexDirection: "row",
				flexWrap: "wrap",
			}}
		>
			{METADATA_DEFINITIONS.map(
				({ label, render, flexGrow }) => (
					<ListItem
						disableGutters
						disablePadding
						key={label}
						sx={{
							flexGrow,
							width: 240,
						}}
					>
						<ListItemText
							primary={render(issue)}
							secondary={label}
						/>
					</ListItem>
				),
			)}
		</List>
	);
};

type IssueCommentProps = {
	comment: RepoIssueCommentSchema;
	index: number;
};
const IssueComment: FC<IssueCommentProps> = (
	props,
) => {
	const { index, comment } = props;
	return (
		<Box>
			<Typography
				fontWeight="bold"
				component="a"
				href={comment.html_url}
				sx={{
					textDecoration: "none",
				}}
			>
				Comment #{index}
			</Typography>
			<List
				dense
				sx={{
					display: "flex",
					flexDirection: "row",
				}}
			>
				<ListItemText
					primary={normalizeDateString(
						comment.created_at,
					)}
					secondary="Created"
					sx={{
						flexGrow: 1,
					}}
				/>
				<ListItemText
					primary={normalizeDateString(
						comment.updated_at,
					)}
					secondary="Last updated"
				/>
			</List>
			<Markdown
				markdownContent={
					comment.body ?? undefined
				}
				emptyText="This comment does not have a body or its body not is cached."
			/>
		</Box>
	);
};

export const IssueDetailsPage: FC = () => {
	const { issue, comments } =
		useLoaderData() as LoaderData;

	const path = `~/repositories/${issue.repo_full_name}/issues/${issue.issue_number}`;
	const breadcrumbsProps: SxProps<Theme> = {
		sx: {
			overflow: "auto",
			flexGrow: { xs: 0, sm: 1 },
		},
	};

	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs
					path={path}
					breadcrumbsProps={breadcrumbsProps}
				/>
			}
		>
			<Container
				maxWidth="sm"
				sx={{
					display: "flex",
					paddingY: 4,
					gap: 2,
					flexDirection: "column",
				}}
			>
				<Box>
					<Typography
						fontWeight="bold"
						fontSize="x-large"
						component="a"
						href={issue.html_url}
						sx={{
							textDecoration: "none",
						}}
					>
						{issue.title}
					</Typography>
					<IssueMetaData issue={issue} />
					<Markdown
						markdownContent={
							issue.body ?? undefined
						}
						emptyText="This issue does not have a body or its body is not cached."
					/>
				</Box>
				{comments.map((comment, index) => (
					<IssueComment
						key={`comment-${comment.id}`}
						index={index + 1}
						comment={comment}
					/>
				))}
			</Container>
		</WithAppBar>
	);
};
