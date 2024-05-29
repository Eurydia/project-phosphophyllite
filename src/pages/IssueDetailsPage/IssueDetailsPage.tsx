import { Container, Stack } from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { StyledCard } from "~components/StyledCard";
import {
	commentToMetadata,
	issueToMetadata,
} from "~core/text";
import { CommentSchema } from "~types/schema";
import { RepoDetailsNavView } from "~views/RepoDetailsNavView";
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
			href={comment.html_url}
			title={title}
			metadata={metadata}
			content={content}
		/>
	);
};

export const IssueDetailsPage: FC = () => {
	const { issue, comments } =
		useLoaderData() as LoaderData;

	const metadata = issueToMetadata(issue);
	const content =
		issue.body ??
		"This issue does not have a body or its body is not cached.";

	return (
		<RepoDetailsNavView tab={1}>
			<Container maxWidth="sm">
				<Stack spacing={2}>
					<StyledCard
						href={issue.html_url}
						title={issue.title}
						metadata={metadata}
						content={content}
					/>
					{comments.map((comment, index) => (
						<IssueComment
							key={`comment-${index}`}
							index={index}
							comment={comment}
						/>
					))}
				</Stack>
			</Container>
		</RepoDetailsNavView>
	);
};
