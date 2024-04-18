import {
	CssBaseline,
	ThemeProvider,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import {
	RouterProvider,
	createHashRouter,
	redirect,
} from "react-router-dom";
import {
	CollectionDetailsPage,
	loaderCollectionDetailsPage,
} from "~pages/CollectionDetailsPage";
import {
	CollectionListPage,
	loaderCollectionListPage,
} from "~pages/CollectionListPage";
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
import { SettingsPage } from "~pages/SettingsPage/SettingsPage";
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
					path: "/repositories",
					element: <RepoListPage />,
					loader: loaderRepoListPage,
				},
				{
					path: "/repositories/:owner",
					element: null,
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
					path: "/collections",
					element: <CollectionListPage />,
					loader: loaderCollectionListPage,
				},
				{
					path: "/collections/:collectionName",
					element: <CollectionDetailsPage />,
					loader: loaderCollectionDetailsPage,
				},
				{
					path: "/settings",
					element: <SettingsPage />,
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
