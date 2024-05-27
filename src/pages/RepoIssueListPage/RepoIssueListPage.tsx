import { FC } from "react";
import { useLoaderData } from "react-router";
import { IssueDataTable } from "~components/IssueDataTable";
import { RepoDetailsNavView } from "~views/RepoDetailsNavView";
import { LoaderData } from "./loader";

export const RepoIssueListPage: FC = () => {
	const {
		repoOptions,
		issues,
		title,
		ownerType,
		repoFullNames,
		state,
	} = useLoaderData() as LoaderData;

	return (
		<RepoDetailsNavView tab={1}>
			<IssueDataTable
				repoOptions={repoOptions}
				issues={issues}
				title={title}
				ownerType={ownerType}
				repoFullNames={repoFullNames}
				state={state}
			/>
		</RepoDetailsNavView>
	);
};
