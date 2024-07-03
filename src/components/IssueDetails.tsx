import {
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { invoke } from "@tauri-apps/api";
import { FC, ReactNode, useRef } from "react";
import { normalizeDateString } from "~core/time";
import { Issue } from "~types/schema";
import { Markdown } from "./Markdown";
import { PaddedPaper } from "./PaddedPaper";
import { StyledGrid } from "./StyledGrid";

type IssueDetailsProps = {
	issue: Issue;
};
export const IssueDetails: FC<
	IssueDetailsProps
> = (props) => {
	const { issue } = props;
	const {
		closedAt,
		createdAt,
		body,
		htmlUrl,
		id,
		ownerType,
		state,
		title,
		updatedAt,
	} = issue;

	const normCreated = normalizeDateString(
		createdAt,
		"Unknown",
	);
	const normClosed = normalizeDateString(
		closedAt,
		"Never",
	);
	const normUpdated =
		normalizeDateString(updatedAt);
	const content =
		body ??
		"This issue does not have a body or its body is not cached.";

	const openIssue = () => {
		invoke("open_url", { url: htmlUrl });
	};
	const link = (
		<Typography
			component="a"
			onClick={openIssue}
		>
			{htmlUrl}
		</Typography>
	);
	const { current: headers } = useRef([
		"Issue ID",
		"Title",
		"State",
		"Owner type",
		"Created",
		"Last updated",
		"Closed",
		"Issue URL",
	]);
	const { current: items } = useRef<ReactNode[]>([
		id,
		title,
		state,
		ownerType,
		normCreated,
		normUpdated,
		normClosed,
		link,
	]);

	return (
		<PaddedPaper
			square
			variant="outlined"
		>
			<Stack spacing={2}>
				<StyledGrid
					items={items}
					headers={headers}
				/>
				<Divider flexItem />
				<Markdown markdownContent={content} />
			</Stack>
		</PaddedPaper>
	);
};
