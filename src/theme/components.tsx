import {
	alpha,
	createTheme,
} from "@mui/material";
import "./components.css";
import { themePalette } from "./palette";

export const themeComponent = createTheme({
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
				"*": {
					backgroundColor:
						themePalette.palette.background,
				},
				"a": {
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
