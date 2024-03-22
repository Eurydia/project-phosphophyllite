import {
	CssBaseline,
	ThemeProvider,
} from "@mui/material";
import {
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";
import { Home, homeLoader } from "~pages/Home";
import {
	ProjectInfo,
	projectInfoLoader,
} from "~pages/project/ProjectInfo";
import {
	ProjectCreate,
	projectCreateLoader,
} from "~pages/project/ProjectCreate";
import { Error } from "~pages/ErrorBoundary";
import { themeComposed } from "./theme";

const router = createBrowserRouter(
	[
		{
			index: true,
			element: <Home />,
			loader: homeLoader,
			errorElement: <Error />,
		},
		{
			path: "/project",
			children: [
				{
					path: "/project/create",
					element: <ProjectCreate />,
					loader: projectCreateLoader,
				},
				{
					path: "/project/:projectId",
					element: <ProjectInfo />,
					loader: projectInfoLoader,
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
