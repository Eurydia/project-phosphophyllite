import {
	AppBar,
	Box,
	Divider,
} from "@mui/material";
import { FC, Fragment } from "react";
import { Outlet } from "react-router";
import { AppHeader } from "~components/AppHeader";

export const HomeGroupView: FC = () => {
	return (
		<Fragment>
			<AppBar elevation={0}>
				<AppHeader />
				<Divider flexItem />
			</AppBar>
			<Box marginTop={8}>
				<Outlet />
			</Box>
		</Fragment>
	);
};
