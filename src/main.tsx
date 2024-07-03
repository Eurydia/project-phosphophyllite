import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { open as shellOpen } from "@tauri-apps/api/shell";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { themeComposed } from "./theme";

document.addEventListener(
	"DOMContentLoaded",
	() => {
		document.body.addEventListener(
			"click",
			(event) => {
				const target = event.target as Element;
				if (target.tagName !== "A") {
					return;
				}
				const href = target.getAttribute("href");
				if (!href || !href.startsWith("http")) {
					return;
				}
				event.preventDefault();
				shellOpen(href);
			},
		);
	},
);

ReactDOM.createRoot(
	document.getElementById("root")!,
).render(
	<React.StrictMode>
		<ThemeProvider theme={themeComposed}>
			<CssBaseline />
			<SnackbarProvider
				preventDuplicate
				maxSnack={3}
				autoHideDuration={1250}
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
