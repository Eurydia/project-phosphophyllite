import {
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { FC, Fragment } from "react";
import { useLoaderData } from "react-router";
import { CommandPalette } from "~components/CommandPalette";

import { useNavigationalCommands } from "~hooks/useNavigationalCommands";
import { useSystemCommands } from "~hooks/useSystemCommands";
import { HomePageLoaderData } from "./loader";

export const HomePage: FC = () => {
	const { repositories } =
		useLoaderData() as HomePageLoaderData;

	const systemCommands = useSystemCommands();
	const navigationalCommands =
		useNavigationalCommands(repositories);

	const commands = [
		...systemCommands,
		...navigationalCommands,
	];
	return (
		<Fragment>
			<CommandPalette commands={commands} />
			<List>
				{repositories.map((repository) => (
					<ListItem key={repository.full_name}>
						<ListItemText
							primary={repository.full_name}
							secondary={repository.description}
						/>
					</ListItem>
				))}
			</List>
		</Fragment>
	);
};
