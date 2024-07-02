import { FC } from "react";
import {
	RouterProvider,
	redirect,
} from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { ErrorElement } from "~pages/ErrorElement";
import {
	IssueDetailsPage,
	loaderIssueDetailsPage,
} from "~pages/IssueDetailsPage";
import {
	IssueListPage,
	issueListLoader,
} from "~pages/IssueListPage";
import {
	RepoIssueListPage,
	loaderRepoIssueListPage,
} from "~pages/RepoIssueListPage";
import {
	RepoListPage,
	repoListLoader,
} from "~pages/RepoListPage";
import {
	RepoMetadataPage,
	loaderRepoMetadataPage,
} from "~pages/RepoMetadataPage";
import {
	RepoReadmePage,
	loaderRepoReadmePage,
} from "~pages/RepoReadmePage";
import {
	SettingsPage,
	loaderSettingsPage,
} from "~pages/SettingsPage";
import { HomeGroupView } from "~views/HomeGroupView";
import { RepoGroupView } from "~views/RepoGroupView";
import { SettingGroupView } from "~views/SettingGroupView";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomeGroupView />,
		errorElement: <ErrorElement />,
		children: [
			{
				index: true,
				loader: () =>
					redirect("/Repositories", 301),
			},
			{
				path: "Repositories",
				element: <RepoListPage />,
				loader: repoListLoader,
			},
			{
				path: "Repositories/:owner",
				loader: async ({ params }) =>
					redirect(
						`/Repositories?fullName=${params.owner}`,
						301,
					),
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
		element: <RepoGroupView />,
		errorElement: <ErrorElement />,
		children: [
			{
				index: true,
				element: <RepoReadmePage />,
				loader: loaderRepoReadmePage,
			},
			{
				path: "Metadata",
				element: <RepoMetadataPage />,
				loader: loaderRepoMetadataPage,
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
	return <RouterProvider router={router} />;
};
