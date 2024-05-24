import { Typography } from "@mui/material";
import { FC } from "react";
import { useRouteError } from "react-router";
import { MainView } from "~views/MainView";

export const ErrorBoundry: FC = () => {
	const { status, statusText } =
		useRouteError() as {
			status: string;
			statusText: string;
		};
	return (
		<MainView location="">
			<Typography
				component="h1"
				variant="h1"
			>
				{status}
			</Typography>
			<Typography
				paragraph
				component="p"
				variant="body1"
			>
				{statusText}
			</Typography>
		</MainView>
	);
};
