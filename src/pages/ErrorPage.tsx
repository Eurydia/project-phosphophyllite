import {
	Divider,
	Typography,
} from "@mui/material";
import { FC, Fragment } from "react";
import { useRouteError } from "react-router";
import { AppHeader } from "~components/AppHeader";
import { CommandPalette } from "~components/CommandPalette";

export const ErrorPage: FC = () => {
	const err = useRouteError() as {
		status: string;
		statusText: string;
	};
	return (
		<Fragment>
			<CommandPalette localCommands={[]} />
			<AppHeader />
			<Divider flexItem />
			<Typography variant="h1">
				{err.status}
			</Typography>
			<Typography variant="body1">
				{err.statusText}
			</Typography>
		</Fragment>
	);
};
