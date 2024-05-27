import {
	Container,
	Paper,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { MainView } from "~views/MainView";
import { LoaderData } from "./loader";

import { Markdown } from "~components/Markdown";
import { normalizeDateString } from "~core/time";
import {
	RepoIssueCommentSchema,
	RepoIssueSchema,
} from "~types/schemas";

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

	const msg = `${createdMsg} (${updatedMsg})`;

	return (
		<Paper
			variant="outlined"
			sx={{ padding: 2 }}
		>
			<Typography
				fontWeight="bold"
				component="a"
				href={comment.html_url}
			>
				Comment #{index}
			</Typography>
			<Typography
				width="100%"
				flexDirection="row"
				flexWrap="wrap"
				variant="subtitle1"
				fontSize="small"
			>
				{msg}
			</Typography>
			<Markdown
				emptyText="This comment does not have a body or its body not is cached."
				markdownContent={
					comment.body ?? undefined
				}
			/>
		</Paper>
	);
};

export const IssueDetailsPage: FC = () => {
	const { issue, comments } =
		useLoaderData() as LoaderData;

	return (
		<MainView>
			<Container maxWidth="sm">
				<Paper
					variant="outlined"
					sx={{ padding: 2 }}
				>
					<Typography
						fontWeight="bold"
						fontSize="x-large"
						component="a"
						href={issue.html_url}
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
		</MainView>
	);
};
