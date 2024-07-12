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
import { normalizeDateString } from "~core/time";
import { useRepositoryCommands } from "~hooks/useRepositoryCommands";
import { RepositoryPageLoaderData } from "./loader";

export const RepositoryPage: FC = () => {
	const { repository, issues } =
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

	const repositoryCommands =
		useRepositoryCommands(repository, issues);

	const decodedReadme =
		readme !== undefined
			? tryDecodeBase64(readme) ?? ""
			: "";

	const listItems: {
		label: string;
		value: string;
	}[] = [
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
			value: normalizeDateString(created_at),
		},
		{
			label: "Last updated",
			value: normalizeDateString(updated_at),
		},
		{
			label: "Last pushed",
			value: normalizeDateString(pushed_at),
		},
	];

	return (
		<Container maxWidth="sm">
			<CommandPalette
				localCommands={repositoryCommands}
			/>
			<Stack
				spacing={2}
				divider={<Divider />}
			>
				<TerminalStyleList items={listItems} />
				<Typography whiteSpace="pre-wrap">
					{decodedReadme}
				</Typography>
				<Fragment>
					{issues.map(
						({ number, title, state }) => (
							<Fragment
								key={`#${number} ${title}`}
							>
								<Typography>
									#{number} ({state}) {title}
								</Typography>
							</Fragment>
						),
					)}
				</Fragment>
			</Stack>
		</Container>
	);
};
