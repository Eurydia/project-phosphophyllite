import {
	Container,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { FC, ReactNode } from "react";
import { useLoaderData } from "react-router";
import { CommandPalette } from "~components/CommandPalette";
import { TerminalStyleList } from "~components/TerminalStyleList";
import { formatTimestamp } from "~core/format";
import { useIssuePageCommands } from "~hooks/useIssueCommands";
import { IssuePageLoaderData } from "./loader";

export const IssuePage: FC = () => {
	const {
		currentIssue,
		comments,
		repository,
		otherIssues,
	} = useLoaderData() as IssuePageLoaderData;

	const commands = useIssuePageCommands(
		repository,
		currentIssue,
		otherIssues,
	);

	const {
		body,
		closed_at,
		state,
		title,
		updated_at,
		created_at,
		user_type,
	} = currentIssue;

	const content =
		body ??
		"This issue does not have a body or its body is not cached.";

	const listItems: {
		label: string;
		value: ReactNode;
	}[] = [
		{
			label: "Title",
			value: title,
		},
		{
			label: "State",
			value: state,
		},
		{
			label: "User type",
			value: user_type,
		},
		{
			label: "Created",
			value: formatTimestamp(created_at),
		},
		{
			label: "Last updated",
			value: formatTimestamp(updated_at),
		},
		{
			label: "Closed",
			value: formatTimestamp(closed_at),
		},
		{
			label: "Labels",
			value: currentIssue.issue_labels || "None",
		},
	];

	console.log(currentIssue);

	return (
		<Container maxWidth="sm">
			<CommandPalette commands={commands} />
			<Stack
				spacing={2}
				padding={2}
				divider={
					<Divider
						flexItem
						variant="middle"
					/>
				}
			>
				<TerminalStyleList items={listItems} />
				<Typography whiteSpace="pre-wrap">
					{content}
				</Typography>
				{comments.map(
					({
						body,
						created_at,
						updated_at,
						url,
					}) => (
						<Stack
							key={url}
							spacing={2}
						>
							<TerminalStyleList
								items={[
									{
										label: "Created",
										value:
											formatTimestamp(created_at),
									},
									{
										label: "Last updated",
										value:
											formatTimestamp(updated_at),
									},
								]}
							/>
							<Typography whiteSpace="pre-wrap">
								{body}
							</Typography>
						</Stack>
					),
				)}
			</Stack>
		</Container>
	);
};
