import {
	alpha,
	createTheme,
} from "@mui/material";

export const themePalette = createTheme({
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
		success: {
			main: "#487500",
		},
		error: {
			main: "#800200",
		},
		info: {
			main: "#007575",
		},
	},
});
