import { Typography } from "@mui/material";
import { FC } from "react";
import { useRouteError } from "react-router";
import { AppHeaderView } from "~views/AppHeaderView";

export const ErrorBoundry: FC = () => {
	const { status, statusText } =
		useRouteError() as {
			status: string;
			statusText: string;
		};
	return (
		<AppHeaderView nav={null}>
			<Typography variant="h1">
				{status}
			</Typography>
			<Typography variant="body1">
				{statusText}
			</Typography>
		</AppHeaderView>
	);
};
