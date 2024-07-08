import {
	AppBar,
	Box,
	Divider,
} from "@mui/material";
import { FC, Fragment } from "react";
import { Outlet } from "react-router";
import { AppHeader } from "~components/AppHeader";
import { CommandPalette } from "~components/CommandPalette";

export const HomeGroupView: FC = () => {
	return (
		<Fragment>
			<AppBar elevation={0}>
				<AppHeader />
				<Divider flexItem />
			</AppBar>
			<Box marginTop={8}>
				<CommandPalette />
				<Outlet />
			</Box>
		</Fragment>
	);
};
