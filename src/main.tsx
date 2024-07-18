import {
	CssBaseline,
	styled,
	ThemeProvider,
} from "@mui/material";
import { program } from "commander";
import {
	MaterialDesignContent,
	SnackbarProvider,
} from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { themeComposed } from "~theme/composed";
import "./main.css";

program
	.option("-d, --debug", "output extra debugging")
	.option("-s, --small", "small pizza size")
	.option(
		"-p, --pizza-type <type>",
		"flavour of pizza",
	);

program.parse(["-d"], {
	from: "user",
});

console.log(program.opts());

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
				{/* <App /> */}
			</ThemeProvider>
		</SnackbarProvider>
	</React.StrictMode>,
);
