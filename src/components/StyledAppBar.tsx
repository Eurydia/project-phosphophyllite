import { AppBar, styled } from "@mui/material";

export const StyledAppBar = styled(AppBar)(
	({ theme }) => ({
		borderTopWidth: "0px",
		borderRightWidth: "0px",
		borderLeftWidth: "0px",
		position: "relative",
		zIndex: theme.zIndex.drawer + 1,
	}),
);
