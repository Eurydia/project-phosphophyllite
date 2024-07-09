import {
	List,
	ListItem,
	ListItemText,
} from "@mui/material";
import { FC, Fragment } from "react";
import { useLoaderData } from "react-router";
import { CommandPalette } from "~components/CommandPalette";
import { HomePageLoaderData } from "./loader";

export const HomePage: FC = () => {
	const { repositories } =
		useLoaderData() as HomePageLoaderData;

	return (
		<Fragment>
			<CommandPalette localCommands={[]} />
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
