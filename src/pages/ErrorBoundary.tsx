import { FC, useEffect } from "react";
import {
	Box,
	Container,
	Typography,
} from "@mui/material";
import {
	ErrorResponse,
	useRouteError,
} from "react-router";
import { WithAppBar } from "~views/WithAppBar";

export const Error: FC = () => {
	const error = useRouteError() as ErrorResponse;
	useEffect(() => {
		document.title = `${error.status} ${error.statusText}`;
	}, []);

	return (
		<WithAppBar location={error.statusText}>
			<Container maxWidth="md">
				<Box padding={4}>
					<Typography
						component="h1"
						variant="h1"
					>
						{error.status}
					</Typography>
					<Typography
						paragraph
						component="p"
						variant="body1"
					>
						{error.statusText}
					</Typography>
				</Box>
			</Container>
		</WithAppBar>
	);
};
