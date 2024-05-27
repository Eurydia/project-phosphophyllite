import {
	Box,
	Stack,
	Toolbar,
} from "@mui/material";
import { FC, ReactNode } from "react";
import { StyledAppBar } from "~components/StyledAppBar";

type TabNavViewProps = {
	nav: ReactNode;
	children: ReactNode;
};
export const TabNavView: FC<TabNavViewProps> = (
	props,
) => {
	const { nav, children } = props;
	return (
		<Box>
			<StyledAppBar variant="outlined">
				<Toolbar
					disableGutters
					variant="dense"
				>
					<Stack
						width="100%"
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						{nav}
					</Stack>
				</Toolbar>
			</StyledAppBar>
			{children}
		</Box>
	);
};
