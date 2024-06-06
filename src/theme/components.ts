import {
	alpha,
	createTheme,
} from "@mui/material";
import { themePalette } from "./palette";
const BG_PAPER =
	themePalette.palette.background.paper;
const TEXT_SND =
	themePalette.palette.text.secondary;
const PRM_MAIN =
	themePalette.palette.primary.main;
const SND_MAIN =
	themePalette.palette.secondary.main;

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
			styleOverrides: ({ spacing }) => {
				return {
					"*": {
						scrollbarColor: `${TEXT_SND} ${BG_PAPER}`,
					},
					"html": {
						backgroundColor: BG_PAPER,
						fontFamily: `"Courier New" Courier, monospace`,
					},
					"a": {
						"color": alpha(PRM_MAIN, 0.78),
						"cursor": "pointer",
						"&:hover": {
							color: alpha(SND_MAIN, 0.78),
						},
					},
					"code": {
						display: "block",
						width: "100%",
						whiteSpace: "wrap",
						paddingLeft: spacing(2),
					},
				};
			},
		},
	},
});
