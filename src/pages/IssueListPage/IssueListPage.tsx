import { FC } from "react";
import { useLoaderData } from "react-router-dom";
import { IssueDataTable } from "~components/IssueDataTable";
import { LoaderData } from "./loader";

export const IssueListPage: FC = () => {
	const { issues } =
		useLoaderData() as LoaderData;

	return <IssueDataTable issues={issues} />;
};
