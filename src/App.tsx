import { useSync } from "hooks/useSync";
import { FC, useEffect } from "react";
import {
	RouterProvider,
	redirect,
} from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { ErrorBoundry } from "~pages/ErrorBoundary";
import { loaderHome } from "~pages/HomePage";
import { HomePage } from "~pages/HomePage/HomePage";
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
	RepoIssueListPage,
	loaderRepoIssueListPage,
} from "~pages/RepoIssueListPage";
import {
	RepoListPage,
	loaderRepoListPage,
} from "~pages/RepoListPage";
import { SettingsIssuePage } from "~pages/SettingsIssuePage";
import { SettingsPage } from "~pages/SettingsPage";
import { SettingsRepoPage } from "~pages/SettingsRepoPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
		loader: loaderHome,
		errorElement: <ErrorBoundry />,
	},
	{
		path: "/repositories",
		element: <RepoListPage />,
		loader: loaderRepoListPage,
		errorElement: <ErrorBoundry />,
	},
	{
		path: "/issues",
		element: <IssueListPage />,
		loader: loaderIssueListPage,
		errorElement: <ErrorBoundry />,
	},
	{
		errorElement: <ErrorBoundry />,
		path: "/repositories/:owner",
		loader: ({ params }) => {
			return redirect(
				`/Repositories?name=${params.owner}`,
			);
		},
	},
	{
		errorElement: <ErrorBoundry />,
		path: "/repositories/:owner/:repo",
		element: <RepoDetailsPage />,
		loader: loaderRepoDetailsPage,
	},
	{
		errorElement: <ErrorBoundry />,
		path: "/repositories/:owner/:repo/issues",
		element: <RepoIssueListPage />,
		loader: loaderRepoIssueListPage,
	},
	{
		errorElement: <ErrorBoundry />,
		path: "/repositories/:owner/:repo/issues/:issueNumber",
		element: <IssueDetailsPage />,
		loader: loaderIssueDetailsPage,
	},
	{
		path: "/settings",
		element: <SettingsPage />,
	},
	{
		path: "/settings/repository",
		element: <SettingsRepoPage />,
	},
	{
		path: "/settings/issue",
		element: <SettingsIssuePage />,
	},
]);

export const App: FC = () => {
	const { lastSync, syncFn } = useSync();
	useEffect(() => {
		const initSync = async () => {
			const reqs = lastSync.map(
				async (dStr, index) => {
					const marker = new Date(dStr).getTime();
					const delta = Date.now() - marker;
					if (
						Number.isNaN(delta) ||
						delta / 1000 < 86400
					) {
						return;
					}
					await syncFn[index]();
				},
			);
			await Promise.all(reqs);
		};
		initSync();
	}, []);
	return <RouterProvider router={router} />;
};
