import { createTheme } from "@mui/material";
import { themeComponent } from "./components";
import { themePalette } from "./palette";
import { themeTypography } from "./typography";

export const themeComposed = createTheme({
	palette: themePalette.palette,
	components: themeComponent.components,
	typography: themeTypography.typography,
});
