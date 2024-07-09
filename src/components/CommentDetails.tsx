import {
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { invoke } from "@tauri-apps/api";
import { FC, ReactNode, useRef } from "react";
import { normalizeDateString } from "~core/time";
import { Comment } from "~types/schema";
import { Markdown } from "./Markdown";
import { PaddedPaper } from "./PaddedPaper";
import { TerminalStyleList } from "./TerminalStyleList";

type CommentDetailsProps = {
	comment: Comment;
};
export const CommentDetails: FC<
	CommentDetailsProps
> = (props) => {
	const { comment } = props;
	const {
		body,
		htmlUrl,
		id,
		createdAt,
		updatedAt,
	} = comment;

	const normCreated =
		normalizeDateString(createdAt);
	const normUpdated =
		normalizeDateString(updatedAt);
	const content =
		body ??
		"This comment does not have a body or its body is not cached.";

	const link = (
		<Typography
			component="a"
			onClick={() => {
				invoke("open_url", { url: htmlUrl });
			}}
		>
			{htmlUrl}
		</Typography>
	);
	const { current: headers } = useRef([
		"Comment  ID",
		"Created",
		"Last updated",
		"Comment URL",
	]);
	const { current: items } = useRef<ReactNode[]>([
		id,
		normCreated,
		normUpdated,
		link,
	]);

	return (
		<PaddedPaper
			square
			variant="outlined"
		>
			<Stack spacing={2}>
				<TerminalStyleList
					items={items}
					headers={headers}
				/>
				<Divider flexItem />

				<Markdown markdownContent={content} />
			</Stack>
		</PaddedPaper>
	);
};
