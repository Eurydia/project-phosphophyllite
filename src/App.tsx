import { useSnackbar } from "notistack";
import { FC, useEffect } from "react";
import {
	RouterProvider,
	createBrowserRouter,
	redirect,
} from "react-router-dom";
import { SYNC_DETAILS } from "~constants";
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
	const { enqueueSnackbar } = useSnackbar();

	const enqueueError = (err: any) => {
		enqueueSnackbar({
			message: String(err),
			variant: "error",
		});
		throw err;
	};

	const handleSync = async (index: number) => {
		const { promise, item } = SYNC_DETAILS[index];
		const res = await promise(enqueueError).catch(
			() => [false],
		);
		if (res.every((r) => r)) {
			enqueueSnackbar({
				message: `${item} is up to date`,
				variant: "success",
			});
		}
	};
	useEffect(() => {
		const initSync = async () => {
			await handleSync(0);
			await handleSync(1);
			await handleSync(2);
		};
		initSync();
	}, []);

	return <RouterProvider router={router} />;
};
