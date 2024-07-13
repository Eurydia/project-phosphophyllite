import { Box } from "@mui/material";
import { FC } from "react";
import { Outlet } from "react-router";

export const HomeGroupView: FC = () => {
	return (
		<Box paddingY={2}>
			<Outlet />
			{/* <AppBar elevation={0}>
			// 	<AppHeader />
			// 	<Divider flexItem />
			// </AppBar> */}
		</Box>
	);
};
