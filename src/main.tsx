import {
	CssBaseline,
	ThemeProvider,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { themeComposed } from "theme";
import { openLink } from "~tauri/open";
import { App } from "./App";
import "./main.css";

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
				openLink(href);
			},
		);
	},
);

ReactDOM.createRoot(
	document.getElementById("root")!,
).render(
	<React.StrictMode>
		<SnackbarProvider
			preventDuplicate
			maxSnack={3}
			autoHideDuration={3500}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "left",
			}}
		>
			<ThemeProvider theme={themeComposed}>
				<CssBaseline />
				<App />
			</ThemeProvider>
		</SnackbarProvider>
	</React.StrictMode>,
);
