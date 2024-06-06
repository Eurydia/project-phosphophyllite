import { Container, Stack } from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { CommentDetails } from "~components/CommentDetails";
import { IssueDetails } from "~components/IssueDetails";
import { LoaderData } from "./loader";

export const IssueDetailsPage: FC = () => {
	const { issue, comments } =
		useLoaderData() as LoaderData;

	const renderedComments = comments.map(
		(comment, index) => (
			<CommentDetails
				key={`comment-${index}`}
				comment={comment}
			/>
		),
	);

	return (
		<Container maxWidth="sm">
			<Stack
				spacing={2}
				padding={2}
			>
				<IssueDetails issue={issue} />
				{renderedComments}
			</Stack>
		</Container>
	);
};
