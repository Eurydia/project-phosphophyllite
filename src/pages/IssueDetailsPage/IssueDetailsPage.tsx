import {
	Container,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { invoke } from "@tauri-apps/api";
import { FC, useRef } from "react";
import { useLoaderData } from "react-router";
import { Markdown } from "~components/Markdown";
import { PaddedPaper } from "~components/PaddedPaper";
import { StyledCard } from "~components/StyledCard";
import { StyledGrid } from "~components/StyledGrid";
import { commentToMetadata } from "~core/text";
import { normalizeDateString } from "~core/time";
import { CommentSchema } from "~types/schema";
import { LoaderData } from "./loader";

type IssueCommentProps = {
	comment: CommentSchema;
	index: number;
};
const IssueComment: FC<IssueCommentProps> = (
	props,
) => {
	const { index, comment } = props;
	const title = `Comment #${index + 1}`;
	const metadata = commentToMetadata(comment);
	const content =
		comment.body ??
		"This comment does not have a body or its body is not cached.";
	return (
		<StyledCard
			href={comment.htmlUrl}
			title={title}
			metadata={metadata}
			content={content}
		/>
	);
};

export const IssueDetailsPage: FC = () => {
	const { issue, comments } =
		useLoaderData() as LoaderData;

	const normCreated = normalizeDateString(
		issue.createdAt,
		"Unknown",
	);
	const normClosed = normalizeDateString(
		issue.closedAt,
		"Never",
	);
	const normUpdated = normalizeDateString(
		issue.updatedAt,
	);
	const content =
		issue.body ??
		"This issue does not have a body or its body is not cached.";
	const { current: headers } = useRef([
		"Created",
		"Last updated",
		"Closed",
	]);
	const { current: items } = useRef([
		normCreated,
		normUpdated,
		normClosed,
	]);

	const openIssue = () => {
		invoke("open_url", { url: issue.htmlUrl });
	};

	return (
		<Container maxWidth="sm">
			<Stack
				spacing={2}
				padding={2}
			>
				<PaddedPaper
					square
					variant="outlined"
				>
					<StyledGrid
						items={items}
						headers={headers}
					/>
					<Divider
						flexItem
						variant="middle"
					>
						Content
					</Divider>
					<Typography
						component="a"
						onClick={openIssue}
						fontWeight="bold"
						fontSize="x-large"
						sx={{
							cursor: "pointer",
						}}
					>
						{issue.title}
					</Typography>
					<Markdown markdownContent={content} />
				</PaddedPaper>
				{comments.map((comment, index) => (
					<IssueComment
						key={`comment-${index}`}
						index={index}
						comment={comment}
					/>
				))}
			</Stack>
		</Container>
	);
};
