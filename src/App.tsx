import { FC, useEffect, useRef } from "react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { useUpdateDB } from "~hooks/useUpdateDB";
import { ErrorPage } from "~pages/ErrorPage";
import {
	HomePage,
	homePageLoader,
} from "~pages/HomePage";
import { IssuePage } from "~pages/IssuePage";
import { issuePageLoader } from "~pages/IssuePage/loader";
import {
	ReadmeEditPage,
	readmeEditPageLoader,
} from "~pages/ReadmeEditPage";
import {
	loaderRepositoryPage,
	RepositoryPage,
} from "~pages/RepositoryPage";
import { shouldUpdateDB } from "~tauri/db/db";
import { HomeGroupView } from "~views/HomeGroupView";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomeGroupView />,
		errorElement: <ErrorPage />,
		children: [
			{
				index: true,
				element: <HomePage />,
				loader: homePageLoader,
			},
			{
				path: ":ownerName/:repoName",
				children: [
					{
						index: true,
						element: <RepositoryPage />,
						loader: loaderRepositoryPage,
					},
					{
						path: "readme",
						element: <ReadmeEditPage />,
						loader: readmeEditPageLoader,
					},
					{
						path: ":issueNumber",
						element: <IssuePage />,
						loader: issuePageLoader,
					},
				],
			},
		],
		// {
		// 	path: "Repositories",
		// 	element: <RepoListPage />,
		// 	loader: repoListLoader,
		// },
		// 		{
		// 			path: "Repositories/:owner",
		// 			loader: async ({ params }) =>
		// 				redirect(
		// 					`/Repositories?fullName=${params.owner}`,
		// 					301,
		// 				),
		// 		},
		// 		{
		// 			path: "Issues",
		// 			element: <IssueListPage />,
		// 			loader: issueListLoader,
		// 		},
		// 	],
		// },
		// {
		// 	path: "Repositories/:owner/:repo",
		// 	element: <RepoGroupView />,
		// 	errorElement: <ErrorElement />,
		// 	children: [
		// 		{
		// 			index: true,
		// 			element: <RepoReadmePage />,
		// 			loader: loaderRepoReadmePage,
		// 		},
		// 		{
		// 			path: "Metadata",
		// 			element: <RepoMetadataPage />,
		// 			loader: loaderRepoMetadataPage,
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
		// {
		// 	path: "/Settings",
		// 	element: <SettingGroupView />,
		// 	errorElement: <ErrorElement />,
		// 	children: [
		// 		{
		// 			index: true,
		// 			element: <SettingsPage />,
		// 			loader: loaderSettingsPage,
		// 		},
		// 	],
	},
]);

export const App: FC = () => {
	const updateDB = useUpdateDB();
	const hasAutoUpdateTriggered = useRef(false);
	useEffect(() => {
		if (hasAutoUpdateTriggered.current) {
			return;
		}
		hasAutoUpdateTriggered.current = true;
		(async () => {
			const shouldUpdate = await shouldUpdateDB();
			if (!shouldUpdate) {
				return;
			}
			await updateDB();
		})();
	}, []);
	return <RouterProvider router={router} />;
};
