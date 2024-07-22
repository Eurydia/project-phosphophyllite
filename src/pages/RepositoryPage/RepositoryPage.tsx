import {
	Container,
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { FC, Fragment } from "react";
import { useLoaderData } from "react-router";
import { CommandPalette } from "~components/CommandPalette";
import { TerminalStyleList } from "~components/TerminalStyleList";
import { tryDecodeBase64 } from "~core/encoding";
import {
	formatAppIssueToListItem,
	formatTimestamp,
} from "~core/format";
import { useNavigationalCommands } from "~hooks/useNavigationalCommands";
import { useRepositoryCommands } from "~hooks/useRepositoryCommands";
import { useSystemCommands } from "~hooks/useSystemCommands";
import { useUpdateRepositoryDescription } from "~hooks/useUpdateRepositoryDescription";
import { useUpdateRespositoryReadme } from "~hooks/useUpdateRepositoryReadme";
import { CommandOption } from "~types/generic";
import { RepositoryPageLoaderData } from "./loader";

export const RepositoryPage: FC = () => {
	const { repository, issues, repositories } =
		useLoaderData() as RepositoryPageLoaderData;

	const {
		archived,
		created_at,
		description,
		private: private_,
		pushed_at,
		updated_at,
		readme,
	} = repository;

	const systemCommands = useSystemCommands();
	const navigationalCommands =
		useNavigationalCommands(repositories);
	const repositoryCommands =
		useRepositoryCommands(repository, issues);
	const updateDescription =
		useUpdateRepositoryDescription();
	const updateReadme =
		useUpdateRespositoryReadme();

	const commands: CommandOption[] = [
		...systemCommands,
		...navigationalCommands,
		...repositoryCommands,
		{
			label: "Edit repository description",
			system: true,
			action: () => updateDescription(repository),
			disabled: repository.archived,
			description: repository.archived
				? "Only available for active repositories"
				: null,
			searchTokens: [],
		},
		{
			label: "Edit repository README",
			system: true,
			action: () => updateReadme(repository),
			disabled: repository.archived,
			description: repository.archived
				? "Only available for active repositories"
				: null,
			searchTokens: [],
		},
	];

	const decodedReadme =
		readme !== undefined
			? tryDecodeBase64(readme)
			: "";

	const openIssueItems = issues
		.filter((issue) => issue.state === "open")
		.map(formatAppIssueToListItem);

	const closedIssueItems = issues
		.filter((issue) => issue.state === "closed")
		.map(formatAppIssueToListItem);

	const listItems: {
		label: string;
		value: string;
	}[] = [
		{
			label: "Owner",
			value: repository.owner_login,
		},
		{
			label: "Name",
			value: repository.name,
		},
		{
			label: "Description",
			value: description,
		},
		{
			label: "Private",
			value: private_ ? "Yes" : "No",
		},
		{
			label: "Archived",
			value: archived ? "Yes" : "No",
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
			label: "Last pushed",
			value: formatTimestamp(pushed_at),
		},
		{
			label: "Issue count",
			value: `${issues.length} total/${openIssueItems.length} open/${closedIssueItems.length} closed`,
		},
	];

	return (
		<Container maxWidth="md">
			<CommandPalette commands={commands} />
			<Stack
				spacing={2}
				divider={<Divider />}
			>
				<TerminalStyleList items={listItems} />
				<Typography whiteSpace="pre-wrap">
					{decodedReadme}
				</Typography>
				<Fragment>
					<Typography>Open issues</Typography>
					<TerminalStyleList
						items={openIssueItems}
					/>
				</Fragment>
				<Fragment>
					<Typography>Closed issues</Typography>
					<TerminalStyleList
						items={closedIssueItems}
					/>
				</Fragment>
			</Stack>
		</Container>
	);
};
