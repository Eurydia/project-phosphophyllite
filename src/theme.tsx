import {
	alpha,
	createTheme,
} from "@mui/material";

const themePalette = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#00D3D0",
		},
		secondary: {
			main: "#D68F3E",
		},
		background: {
			default: "#1B1D2D",
			paper: "#1B1D2D",
		},
		text: {
			primary: alpha("#fff", 0.78),
			secondary: alpha("#fff", 0.57),
		},
	},
});
const themeComponent = createTheme({
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				html: {
					backgroundColor:
						themePalette.palette.background,
				},
				pre: {
					width: "100%",
					overflow: "auto",
				},
			},
		},
	},
});

export const themeComposed = createTheme({
	palette: themePalette.palette,
	components: themeComponent.components,
});
