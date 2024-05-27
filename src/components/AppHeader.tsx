import { Stack } from "@mui/material";
import { FC } from "react";
import { useLocation } from "react-router";
import { StyledBreadcrumbs } from "./StyledBreadcrumbs";

export const AppHeader: FC = () => {
	const { pathname } = useLocation();
	const appPath = "~" + pathname;

	return (
		<Stack
			width="100%"
			justifyContent="center"
			alignItems="center"
		>
			<StyledBreadcrumbs path={appPath} />
		</Stack>
	);
};
