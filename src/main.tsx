import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { themeComposed } from "./theme";

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
