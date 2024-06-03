import { FC } from "react";
import {
	RouterProvider,
	redirect,
} from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { ErrorElement } from "~pages/ErrorElement";
import {
	HomePage,
	homeLoader,
} from "~pages/HomePage";
import {
	IssueListPage,
	issueListLoader,
} from "~pages/IssueListPage";
import {
	RepoListPage,
	repoListLoader,
} from "~pages/RepoListPage";
import { SettingsPage } from "~pages/SettingsPage";
import { HomeGroupView } from "~views/HomeGroupView";
import { SettingGroupView } from "~views/SettingGroupView";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomeGroupView />,
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
	// {
	// 	path: "Repositories/:owner/:repo",
	// 	element: <RepoDetailsGroupLayout />,
	// 	errorElement: <ErrorElement />,
	// 	children: [
	// 		{
	// 			index: true,
	// 			element: <RepoDetailsPage />,
	// 			loader: loaderRepoDetailsPage,
	// 		},
	// 		{
	// 			path: "Issues",
	// 			element: <RepoIssueListPage />,
	// 			loader: loaderRepoIssueListPage,
	// 		},
	// 		{
	// 			path: "Issues/:issueNumber",
	// 			element: <IssueDetailsPage />,
	// 			loader: loaderIssueDetailsPage,
	// 		},
	// 	],
	// },
	{
		path: "/Settings",
		element: <SettingGroupView />,
		errorElement: <ErrorElement />,
		children: [
			{
				index: true,
				element: <SettingsPage />,
			},
			// {
			// 	path: "Repository",
			// 	element: <SettingsRepoPage />,
			// },
			// {
			// 	path: "Issue",
			// 	element: <SettingsIssuePage />,
			// },
		],
	},
]);

export const App: FC = () => {
	return <RouterProvider router={router} />;
};
