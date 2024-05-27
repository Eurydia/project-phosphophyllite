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
	RepoIssueListPage,
	loaderRepoIssueListPage,
} from "~pages/RepoIssueListPage";
import {
	RepoListPage,
	loaderRepoListPage,
} from "~pages/RepoListPage";
import { SettingsPage } from "~pages/SettingsPage";

const router = createBrowserRouter(
	[
		{
			path: "/",
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
			path: "/issues",
			element: <IssueListPage />,
			loader: loaderIssueListPage,
		},
		{
			path: "/repositories/:owner",
			loader: ({ params }) => {
				return redirect(
					`/Repositories?name=${params.owner}`,
				);
			},
		},
		{
			path: "/repositories/:owner/:repo",
			element: <RepoDetailsPage />,
			loader: loaderRepoDetailsPage,
		},
		{
			path: "/repositories/:owner/:repo/issues",
			element: <RepoIssueListPage />,
			loader: loaderRepoIssueListPage,
		},
		{
			path: "/repositories/:owner/:repo/issues/:issueNumber",
			element: <IssueDetailsPage />,
			loader: loaderIssueDetailsPage,
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
	// const { enqueueSnackbar } = useSnackbar();

	// const enqueueError = (err: any) => {
	// 	enqueueSnackbar({
	// 		message: String(err),
	// 		variant: "error",
	// 	});
	// 	throw err;
	// };

	// const handleSync = async (index: number) => {
	// 	const { promise, item } = SYNC_DETAILS[index];
	// 	const res = await promise(enqueueError)
	// 		.then((resp) => resp.every((r) => r))
	// 		.catch(() => false);
	// 	if (res) {
	// 		enqueueSnackbar({
	// 			message: `${item} data is up to date`,
	// 			variant: "success",
	// 		});
	// 	}
	// };
	// useEffect(() => {
	// 	const initSync = async () => {
	// 		await handleSync(0);
	// 		await handleSync(1);
	// 		await handleSync(2);
	// 	};
	// 	initSync();
	// }, []);

	return <RouterProvider router={router} />;
};
