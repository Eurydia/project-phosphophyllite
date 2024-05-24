import {
	CssBaseline,
	ThemeProvider,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import { FC } from "react";
import {
	RouterProvider,
	createBrowserRouter,
	redirect,
} from "react-router-dom";
import { ErrorBoundry } from "~pages/ErrorBoundary";
import {
	Home,
	loaderHome,
} from "~pages/HomePage";
import {
	IssueDetailsPage,
	loaderIssueDetailsPage,
} from "~pages/IssueDetailsPage";
import {
	IssueListPage,
	loaderIssueListPage,
} from "~pages/IssueListPage";
import {
	RepoDetailsPage,
	loaderRepoDetailsPage,
} from "~pages/RepoDetailsPage";
import {
	RepoListPage,
	loaderRepoListPage,
} from "~pages/RepoListPage";
import { SettingsPage } from "~pages/SettingsPage";
import { themeComposed } from "./theme";

const router = createBrowserRouter(
	[
		{
			index: true,
			element: <Home />,
			loader: loaderHome,
			errorElement: <ErrorBoundry />,
		},
		{
			path: "/repositories",
			element: <RepoListPage />,
			loader: loaderRepoListPage,
		},
		{
			path: "/repositories/:owner",
			loader: ({ params }) =>
				redirect(
					`/repositories/?name=${params.owner}`,
				),
		},
		{
			path: "/repositories/:owner/:repo",
			element: <RepoDetailsPage tab={0} />,
			loader: loaderRepoDetailsPage,
		},
		{
			path: "/repositories/:owner/:repo/issues",
			element: <RepoDetailsPage tab={1} />,
			loader: loaderRepoDetailsPage,
		},
		{
			path: "/repositories/:owner/:repo/issues/:issueNumber",
			element: <IssueDetailsPage />,
			loader: loaderIssueDetailsPage,
		},
		{
			path: "/issues",
			element: <IssueListPage />,
			loader: loaderIssueListPage,
		},
		{
			path: "/settings",
			element: <SettingsPage />,
		},
	],
	{
		basename: "/project-phosphophyllite",
	},
);

export const App: FC = () => {
	return (
		<ThemeProvider theme={themeComposed}>
			<CssBaseline />
			<SnackbarProvider
				preventDuplicate
				maxSnack={3}
				autoHideDuration={1750}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
			>
				<RouterProvider router={router} />
			</SnackbarProvider>
		</ThemeProvider>
	);
};
