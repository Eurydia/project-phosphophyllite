import {
	Box,
	Container,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { useRouteError } from "react-router";
import { WithAppBar } from "~views/WithAppBar";

export const ErrorBoundry: FC = () => {
	const { status, statusText } =
		useRouteError() as {
			status: string;
			statusText: string;
		};
	// useEffect(() => {
	// 	document.title = status.toString();
	// }, []);
	return (
		<WithAppBar location={status}>
			<Container maxWidth="md">
				<Box padding={4}>
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
				</Box>
			</Container>
		</WithAppBar>
	);
};
