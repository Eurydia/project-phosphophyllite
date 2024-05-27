import { AppBar, styled } from "@mui/material";

export const StyledAppBar = styled(AppBar)(
	({ theme }) => ({
		position: "relative",
		zIndex: theme.zIndex.drawer + 1,
	}),
);
