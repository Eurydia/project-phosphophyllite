import {
	CssBaseline,
	ThemeProvider,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import {
	RouterProvider,
	createHashRouter,
} from "react-router-dom";
import { ErrorBoundry } from "~pages/ErrorBoundary";
import { Home, loaderHome } from "~pages/Home";
import { themeComposed } from "./theme";

const router = createHashRouter(
	[
		{
			index: true,
			element: <Home />,
			loader: loaderHome,
			errorElement: <ErrorBoundry />,
		},
		// {
		// 	path: "/project",
		// 	errorElement: <Error />,
		// 	children: [
		// 		{
		// 			path: "/project/:projectName",
		// 			element: <ProjectInfo />,
		// 			loader: loaderProjectInfo,
		// 		},
		// 	],
		// },
		// {
		// 	path: "/ticket",
		// 	errorElement: <Error />,
		// 	children: [
		// 		{
		// 			index: true,
		// 			element: <TicketIdx />,
		// 			loader: loaderTicketHome,
		// 		},
		// 		{
		// 			path: "/ticket/create",
		// 			element: <TicketCreate />,
		// 			loader: loaderTicketCreate,
		// 		},
		// 		{
		// 			path: "/ticket/:ticketId",
		// 			element: <TicketInfo />,
		// 			loader: loaderTicketInfo,
		// 		},
		// 	],
		// },
	],
	{
		basename: "/",
	},
);

export const App = () => {
	return (
		<ThemeProvider theme={themeComposed}>
			<CssBaseline />
			<SnackbarProvider
				preventDuplicate
				maxSnack={3}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
			>
				<RouterProvider router={router} />
			</SnackbarProvider>
		</ThemeProvider>
	);
};
