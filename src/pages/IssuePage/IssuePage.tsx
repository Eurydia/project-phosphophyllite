import {
	Container,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { CommandPalette } from "~components/CommandPalette";
import { TerminalStyleList } from "~components/TerminalStyleList";
import { normalizeDateString } from "~core/time";
import { useIssueCommands } from "~hooks/useIssueCommands";
import { useRepositoryCommands } from "~hooks/useRepositoryCommands";
import { IssuePageLoaderData } from "./loader";

export const IssuePage: FC = () => {
	const {
		currentIssue,
		comments,
		repository,
		issues,
	} = useLoaderData() as IssuePageLoaderData;

	const repositoryCommands =
		useRepositoryCommands(repository, issues);
	const issueCommands =
		useIssueCommands(currentIssue);

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
		value: string;
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
			value: normalizeDateString(
				created_at,
				"Unknown",
			),
		},
		{
			label: "Last updated",
			value: normalizeDateString(
				updated_at,
				"Unknown",
			),
		},
		{
			label: "Closed",
			value: normalizeDateString(
				closed_at,
				"Never",
			),
		},
	];

	return (
		<Container maxWidth="sm">
			<CommandPalette
				commands={[
					...repositoryCommands,
					...issueCommands,
				]}
			/>
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
											normalizeDateString(
												created_at,
											),
									},
									{
										label: "Last updated",
										value:
											normalizeDateString(
												updated_at,
											),
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
