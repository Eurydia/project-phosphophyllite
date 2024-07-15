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
import { tryDecodeBase64 } from "~core/encoding";
import { normalizeDateStringWithTimestamp } from "~core/time";
import { useNavigationalCommands } from "~hooks/useNavigationalCommands";
import { useRepositoryCommands } from "~hooks/useRepositoryCommands";
import { useSystemCommands } from "~hooks/useSystemCommands";
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

	const commands = [
		...systemCommands,
		...navigationalCommands,
		...repositoryCommands,
	];

	const decodedReadme =
		readme !== undefined
			? tryDecodeBase64(readme)
			: "";

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
			value:
				normalizeDateStringWithTimestamp(
					created_at,
				),
		},
		{
			label: "Last updated",
			value:
				normalizeDateStringWithTimestamp(
					updated_at,
				),
		},
		{
			label: "Last pushed",
			value:
				normalizeDateStringWithTimestamp(
					pushed_at,
				),
		},
	];

	const issueItems = issues.map(
		({ number, title, state }) => {
			return {
				label: `#${number}`,
				value: `${title} (${state})`,
			};
		},
	);

	return (
		<Container maxWidth="md">
			<CommandPalette commands={commands} />
			<code>
				<Stack
					spacing={2}
					divider={<Divider />}
				>
					<TerminalStyleList items={listItems} />
					<Typography whiteSpace="pre-wrap">
						{decodedReadme}
					</Typography>
					<TerminalStyleList items={issueItems} />
				</Stack>
			</code>
		</Container>
	);
};
