import {
	CssBaseline,
	ThemeProvider,
} from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import {
	Bounce,
	ToastContainer,
} from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import { themeComposed } from "~theme/composed";
import { App } from "./App";
import "./main.css";

injectStyle();

// const StyledSnackbarComponent = styled(
// 	MaterialDesignContent,
// )(() => ({
// 	"&.notistack-MuiContent-success": {
// 		backgroundColor:
// 			themeComposed.palette.success.main,
// 	},
// 	"&.notistack-MuiContent-error": {
// 		backgroundColor:
// 			themeComposed.palette.error.main,
// 	},
// 	"&.notistack-MuiContent-info": {
// 		backgroundColor:
// 			themeComposed.palette.info.main,
// 	},
// }));

ReactDOM.createRoot(
	document.getElementById("root")!,
).render(
	<React.StrictMode>
		<ThemeProvider theme={themeComposed}>
			<CssBaseline />
			<App />
			<ToastContainer
				position="bottom-left"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="dark"
				transition={Bounce}
			/>
		</ThemeProvider>
	</React.StrictMode>,
);
