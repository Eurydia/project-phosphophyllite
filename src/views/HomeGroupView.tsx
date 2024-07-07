import {
	AppBar,
	Box,
	Divider,
} from "@mui/material";
import { useElementHeight } from "hooks/useElementHeight";
import { FC, Fragment } from "react";
import { Outlet } from "react-router";
import { AppHeader } from "~components/AppHeader";
import { CommandPalette } from "~components/CommandPalette";

export const HomeGroupView: FC = () => {
	const { elemRef, elemHeight } =
		useElementHeight();
	const contentHeight = `calc(100svh - ${elemHeight})`;
	return (
		<Fragment>
			<AppBar
				ref={elemRef}
				elevation={0}
			>
				<AppHeader />
				<Divider flexItem />
			</AppBar>
			<Box
				marginTop={elemHeight}
				height={contentHeight}
				overflow="auto"
			>
				<CommandPalette />
				<Outlet />
			</Box>
		</Fragment>
	);
};
