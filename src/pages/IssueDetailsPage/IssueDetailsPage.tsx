import {
	Container,
	Paper,
	SxProps,
	Theme,
	Typography,
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
];

type IssueMetaDataListProps = {
	issue: RepoIssueSchema;
};
const IssueMetaData: FC<
	IssueMetaDataListProps
> = (props) => {
	const { issue } = props;

	const normalizedCreated = normalizeDateString(
		issue.created_at,
		"unknown",
	);
	const createdMsg = `on ${normalizedCreated}`;

	const normalizedUpdated = normalizeDateString(
		issue.updated_at,
	);
	const updatedMsg = `last updated: ${normalizedUpdated}`;

	const normalizedClosed = normalizeDateString(
		issue.closed_at,
		"never",
	);
	const closedMsg = `closed: ${normalizedClosed}`;

	let msg = `${createdMsg} (${updatedMsg}, ${closedMsg})`;
	return (
		<Typography
			width="100%"
			flexDirection="row"
			flexWrap="wrap"
			gap={0.5}
			variant="subtitle1"
			fontSize="small"
			sx={{
				fontStyle: "italic",
			}}
		>
			{msg}
		</Typography>
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

	const normalizedCreated = normalizeDateString(
		comment.created_at,
	);
	const createdMsg = `on ${normalizedCreated}`;

	const normalizedupdated = normalizeDateString(
		comment.updated_at,
	);
	const updatedMsg = `last updated: ${normalizedupdated}`;

	const msg = `${createdMsg} (${updatedMsg})}`;

	return (
		<Paper
			variant="outlined"
			sx={{ padding: 2 }}
		>
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
			<Typography
				width="100%"
				flexDirection="row"
				flexWrap="wrap"
				variant="subtitle1"
				fontSize="small"
				sx={{
					fontStyle: "italic",
				}}
			>
				{msg}
			</Typography>
			<Markdown
				markdownContent={
					comment.body ?? undefined
				}
				emptyText="This comment does not have a body or its body not is cached."
			/>
		</Paper>
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
				<Paper
					variant="outlined"
					sx={{ padding: 2 }}
				>
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
				</Paper>
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
