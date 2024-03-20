import {
	CssBaseline,
	ThemeProvider,
} from "@mui/material";
import {
	RouterProvider,
	createBrowserRouter,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { ProjectInfo } from "./pages/project/Info";
import { ProjectCreate } from "./pages/project/Create";
import { themeComposed } from "./theme";

const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <Home />,
		},
		{
			path: "/project/:projectId",
			element: <ProjectInfo />,
		},
		{
			path: "/project/create",
			element: <ProjectCreate />,
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
