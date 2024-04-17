import {
	alpha,
	createTheme,
} from "@mui/material";

const themePalette = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: alpha("#00D3D0", 0.7),
		},
		secondary: {
			main: "#D68F3E",
		},
		background: {
			default: "#1B1D2D",
			paper: "#1B1D2D",
		},
		text: {
			primary: alpha("#fff", 0.67),
			secondary: alpha("#fff", 0.5),
		},
	},
});
const themeComponent = createTheme({
	components: {
		MuiBreadcrumbs: {
			styleOverrides: {
				ol: {
					flexWrap: "nowrap",
					width: "100%",
				},
			},
		},
		MuiCssBaseline: {
			styleOverrides: {
				"html": {
					backgroundColor:
						themePalette.palette.background,
				},
				"*": {
					scrollbarWidth: "thin",
				},
				"pre": {
					width: "100%",
					overflow: "auto",
				},
				"table": {
					minWidth: "max-content",
					borderSpacing: "1rem 0.5rem",
				},
				"a": {
					"transition": "color 0.3s ease",
					"color": alpha(
						themePalette.palette.primary.main,
						0.78,
					),
					"&:hover": {
						color: alpha(
							themePalette.palette.secondary.main,
							0.78,
						),
					},
				},
			},
		},
	},
});

export const themeComposed = createTheme({
	palette: themePalette.palette,
	components: themeComponent.components,
});
