import { ThemeProvider } from "@emotion/react";
import "@fontsource/ibm-plex-serif/300.css";
import "@fontsource/ibm-plex-serif/400.css";
import "@fontsource/ibm-plex-serif/500.css";
import "@fontsource/ibm-plex-serif/700.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { themeComposed } from "theme";
import { App } from "./App.tsx";

ReactDOM.createRoot(
	document.getElementById("root")!,
).render(
	<React.StrictMode>
		<ThemeProvider theme={themeComposed}>
			<CssBaseline />
			<SnackbarProvider
				preventDuplicate
				maxSnack={3}
				autoHideDuration={1750}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
			>
				<App />
			</SnackbarProvider>
		</ThemeProvider>
	</React.StrictMode>,
);
