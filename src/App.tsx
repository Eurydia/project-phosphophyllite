import { FC, useEffect, useRef } from "react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { useUpdateDB } from "~hooks/useUpdateDB";
import { ErrorPage } from "~pages/ErrorPage";
import {
	HomePage,
	homePageLoader,
} from "~pages/HomePage";
import {
	IssuePage,
	issuePageLoader,
} from "~pages/IssuePage";
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
						path: ":issueNumber",
						element: <IssuePage />,
						loader: issuePageLoader,
					},
				],
			},
		],
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
