import {
	Divider,
	Typography,
} from "@mui/material";
import { FC, Fragment } from "react";
import { useRouteError } from "react-router";
import { AppHeader } from "~components/AppHeader";

export const ErrorElement: FC = () => {
	const err = useRouteError() as {
		status: string;
		statusText: string;
	};
	return (
		<Fragment>
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
