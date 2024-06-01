import { FC } from "react";
import { useLoaderData } from "react-router";
import { IssueDataTable } from "~components/IssueDataTable";
import { LoaderData } from "./loader";

export const RepoIssueListPage: FC = () => {
	const { issues } =
		useLoaderData() as LoaderData;

	return <IssueDataTable issues={issues} />;
};
