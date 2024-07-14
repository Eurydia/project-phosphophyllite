import {
	CssBaseline,
	styled,
	ThemeProvider,
} from "@mui/material";
import {
	MaterialDesignContent,
	SnackbarProvider,
} from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { themeComposed } from "theme";
import { App } from "./App";
import "./main.css";

// document.addEventListener(
// 	"DOMContentLoaded",
// 	() => {
// 		document.body.addEventListener(
// 			"click",
// 			(event) => {
// 				const target = event.target as Element;
// 				if (target.tagName !== "A") {
// 					return;
// 				}
// 				const href = target.getAttribute("href");
// 				if (!href || !href.startsWith("http")) {
// 					return;
// 				}
// 				event.preventDefault();
// 				openLink(href);
// 			},
// 		);
// 	},
// );

const StyledSnackbarComponent = styled(
	MaterialDesignContent,
)(() => ({
	"&.notistack-MuiContent-success": {
		backgroundColor:
			themeComposed.palette.success.main,
	},
	"&.notistack-MuiContent-error": {
		backgroundColor:
			themeComposed.palette.error.main,
	},
	"&.notistack-MuiContent-info": {
		backgroundColor:
			themeComposed.palette.info.main,
	},
}));

ReactDOM.createRoot(
	document.getElementById("root")!,
).render(
	<React.StrictMode>
		<SnackbarProvider
			Components={{
				success: StyledSnackbarComponent,
				error: StyledSnackbarComponent,
				info: StyledSnackbarComponent,
			}}
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
