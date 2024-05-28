import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { IssueDataTable } from "~components/IssueDataTable";
import { HomeNavView } from "~views/HomeNavView";
import { LoaderData } from "./loader";

export const IssueListPage: FC = () => {
	const { query, issues, repoOptions } =
		useLoaderData() as LoaderData;

	return (
		<HomeNavView tab={2}>
			<IssueDataTable
				issues={issues}
				repoOptions={repoOptions}
				query={query}
			/>
		</HomeNavView>
	);
};
