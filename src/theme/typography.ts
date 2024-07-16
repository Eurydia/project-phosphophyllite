import {
	createTheme,
	responsiveFontSizes,
} from "@mui/material";

const theme = createTheme({
	typography: {
		fontFamily: "'Fira code', monospace",
		fontSize: 18,
	},
});
export const themeTypography =
	responsiveFontSizes(theme);
