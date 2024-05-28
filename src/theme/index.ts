import { createTheme } from "@mui/material";
import { themeComponent } from "./components";
import { themePalette } from "./palette";

export const themeComposed = createTheme({
	palette: themePalette.palette,
	components: themeComponent.components,
});
