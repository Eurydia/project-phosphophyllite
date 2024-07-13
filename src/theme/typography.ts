import {
	createTheme,
	responsiveFontSizes,
} from "@mui/material";

const theme = createTheme({
	typography: {
		fontFamily: "monospace",
		fontSize: 18,
	},
});
export const themeTypography =
	responsiveFontSizes(theme);
