import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { IssueDataTable } from "~components/IssueDataTable";
import { HomeNavView } from "~views/HomeNavView";
import { LoaderData } from "./loader";

export const IssueListPage: FC = () => {
	const {
		issues,
		repoOptions,
		title,
		ownerType,
		repoFullNames,
		state,
	} = useLoaderData() as LoaderData;

	return (
		<HomeNavView tab={2}>
			<IssueDataTable
				issues={issues}
				repoOptions={repoOptions}
				title={title}
				ownerType={ownerType}
				repoFullNames={repoFullNames}
				state={state}
			/>
		</HomeNavView>
	);
};
