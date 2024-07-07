import { Box, Toolbar } from "@mui/material";
import { FC } from "react";
import { useLocation } from "react-router";
import { StyledBreadcrumbs } from "./StyledBreadcrumbs";

export const AppHeader: FC = () => {
	const { pathname } = useLocation();

	const appPath = "~" + pathname;

	return (
		<Toolbar
			disableGutters
			variant="dense"
			sx={{
				width: "100%",
				direction: "row",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Box overflow="hidden">
				<StyledBreadcrumbs path={appPath} />
			</Box>
		</Toolbar>
	);
};
