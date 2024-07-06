import { useSnackbar } from "notistack";
import { FC, useEffect } from "react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { ErrorElement } from "~pages/ErrorElement";
import {
	SettingsPage,
	loaderSettingsPage,
} from "~pages/SettingsPage";
import {
	shouldUpdateDB,
	signalUpdateDB,
} from "~signals/db";
import { HomeGroupView } from "~views/HomeGroupView";
import { SettingGroupView } from "~views/SettingGroupView";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomeGroupView />,
		errorElement: <ErrorElement />,
		children: [
			// {
			// 	index: true,
			// 	loader: () =>
			// 		redirect("/Repositories", 301),
			// },
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
		],
	},
	{
		path: "/Settings",
		element: <SettingGroupView />,
		errorElement: <ErrorElement />,
		children: [
			{
				index: true,
				element: <SettingsPage />,
				loader: loaderSettingsPage,
			},
		],
	},
]);

export const App: FC = () => {
	const { enqueueSnackbar, closeSnackbar } =
		useSnackbar();
	useEffect(() => {
		(async () => {
			const shouldUpdate = await shouldUpdateDB();
			if (!shouldUpdate) {
				return;
			}
			const id = enqueueSnackbar(
				"Updating database",
				{
					persist: true,
					variant: "info",
				},
			);

			await signalUpdateDB().then(
				() =>
					enqueueSnackbar("Update completed", {
						variant: "success",
					}),
				() =>
					enqueueSnackbar(
						"An error occurred during update",
						{
							variant: "error",
						},
					),
			);
			closeSnackbar(id);
		})();
	}, []);
	return <RouterProvider router={router} />;
};
