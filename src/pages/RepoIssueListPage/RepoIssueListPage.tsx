import { FC } from "react";
import { useLoaderData } from "react-router";
import { IssueDataTable } from "~components/IssueDataTable";
import { RepoDetailsNavView } from "~views/RepoDetailsNavView";
import { LoaderData } from "./loader";

export const RepoIssueListPage: FC = () => {
	const { repoOptions, issues, query } =
		useLoaderData() as LoaderData;

	return (
		<RepoDetailsNavView tab={1}>
			<IssueDataTable
				repoOptions={repoOptions}
				issues={issues}
				query={query}
			/>
		</RepoDetailsNavView>
	);
};
