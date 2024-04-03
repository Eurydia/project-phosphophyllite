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
import { ProjectInfo } from "~pages/RepoDetails/RepoDetails";
import { loaderProjectInfo } from "~pages/RepoDetails/loader";
import { themeComposed } from "./theme";

const router = createHashRouter(
	[
		{
			index: true,
			element: <Home />,
			loader: loaderHome,
			errorElement: <ErrorBoundry />,
		},
		{
			path: "/",
			errorElement: <ErrorBoundry />,
			children: [
				{
					path: "/repo/:owner/:repo",
					element: <ProjectInfo />,
					loader: loaderProjectInfo,
				},
			],
		},
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
