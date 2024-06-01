import { HomeGroupLayout } from "layouts/HomeGroupLayout";
import { RepoDetailsGroupLayout } from "layouts/RepoDetailsGroupLayout";
import { FC } from "react";
import {
	RouterProvider,
	redirect,
} from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { SettingGroupLayout } from "~layouts/SettingGroupLayout";
import { ErrorElement } from "~pages/ErrorElement";
import {
	HomePage,
	homeLoader,
} from "~pages/HomePage";
import {
	IssueDetailsPage,
	loaderIssueDetailsPage,
} from "~pages/IssueDetailsPage";
import {
	IssueListPage,
	issueListLoader,
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
	repoListLoader,
} from "~pages/RepoListPage";
import { SettingsIssuePage } from "~pages/SettingsIssuePage";
import { SettingsPage } from "~pages/SettingsPage";
import { SettingsRepoPage } from "~pages/SettingsRepoPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomeGroupLayout />,
		errorElement: <ErrorElement />,
		children: [
			{
				index: true,
				element: <HomePage />,
				loader: homeLoader,
			},
			{
				path: "Repositories",
				element: <RepoListPage />,
				loader: repoListLoader,
			},
			{
				path: "Repositories/:owner",
				errorElement: <ErrorElement />,
				loader: ({ params }) => {
					return redirect(
						`/Repositories?name=${params.owner}`,
					);
				},
			},
			{
				path: "Issues",
				element: <IssueListPage />,
				loader: issueListLoader,
			},
		],
	},
	{
		path: "Repositories/:owner/:repo",
		element: <RepoDetailsGroupLayout />,
		errorElement: <ErrorElement />,
		children: [
			{
				index: true,
				element: <RepoDetailsPage />,
				loader: loaderRepoDetailsPage,
			},
			{
				path: "Issues",
				element: <RepoIssueListPage />,
				loader: loaderRepoIssueListPage,
			},
			{
				path: "Issues/:issueNumber",
				element: <IssueDetailsPage />,
				loader: loaderIssueDetailsPage,
			},
		],
	},
	{
		path: "/Settings",
		element: <SettingGroupLayout />,
		errorElement: <ErrorElement />,
		children: [
			{
				index: true,
				element: <SettingsPage />,
			},
			{
				path: "Repository",
				element: <SettingsRepoPage />,
			},
			{
				path: "Issue",
				element: <SettingsIssuePage />,
			},
		],
	},
]);

export const App: FC = () => {
	return <RouterProvider router={router} />;
};
