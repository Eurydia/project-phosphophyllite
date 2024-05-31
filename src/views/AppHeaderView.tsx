import {
	AppBar,
	Box,
	Divider,
	Toolbar,
} from "@mui/material";
import { FC, ReactNode } from "react";
import { AppHeader } from "~components/AppHeader";

type MainViewProps = {
	children: ReactNode;
	nav: ReactNode;
};
export const AppHeaderView: FC<MainViewProps> = (
	props,
) => {
	const { children, nav } = props;

	return (
		<Box>
			<AppBar
				elevation={0}
				position="relative"
			>
				<Toolbar
					disableGutters
					variant="dense"
				>
					<AppHeader />
				</Toolbar>
				<Divider
					flexItem
					variant="fullWidth"
				/>
				<Toolbar
					disableGutters
					variant="dense"
				>
					{nav}
				</Toolbar>
				<Divider
					flexItem
					variant="fullWidth"
				/>
			</AppBar>
			{children}
		</Box>
	);
};
