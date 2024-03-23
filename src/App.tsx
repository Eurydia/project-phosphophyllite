import {
	CssBaseline,
	ThemeProvider,
} from "@mui/material";
import {
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";
import { Error } from "~pages/ErrorBoundary";
import { Home, loaderHome } from "~pages/Home";
import {
	ProjectInfo,
	loaderProjectInfo,
} from "~pages/Project/ProjectInfo";
import {
	ProjectCreate,
	loaderProjectCreate,
} from "~pages/Project/ProjectCreate";
import {
	TicketIdx,
	loaderTicketIdx,
} from "~pages/TicketIdx";
import {
	TicketCreate,
	loaderTicketCreate,
} from "~pages/Ticket/TicketCreate";
import {
	TicketInfo,
	loaderTicketInfo,
} from "~pages/Ticket/TicketInfo";

import { themeComposed } from "./theme";

const router = createBrowserRouter(
	[
		{
			index: true,
			element: <Home />,
			loader: loaderHome,
			errorElement: <Error />,
		},
		{
			path: "/project",
			children: [
				{
					path: "/project/create",
					element: <ProjectCreate />,
					loader: loaderProjectCreate,
				},
				{
					path: "/project/:projectId",
					element: <ProjectInfo />,
					loader: loaderProjectInfo,
				},
			],
		},
		{
			path: "/ticket",
			children: [
				{
					index: true,
					element: <TicketIdx />,
					loader: loaderTicketIdx,
				},
				{
					path: "/ticket/create",
					element: <TicketCreate />,
					loader: loaderTicketCreate,
				},
				{
					path: "/ticket/:ticketId",
					element: <TicketInfo />,
					loader: loaderTicketInfo,
				},
			],
		},
	],
	{
		basename: "/",
	},
);

export const App = () => {
	return (
		<ThemeProvider theme={themeComposed}>
			<CssBaseline />
			<RouterProvider router={router} />
		</ThemeProvider>
	);
};
