import { LoaderFunction } from "react-router";
import { getPrefIssue } from "resources/pref";
import { IssueQueryPref } from "~types/schema";

export type LoaderData = {
	pref: IssueQueryPref;
};
export const loader: LoaderFunction =
	async () => {
		const pref = await getPrefIssue();
		const loaderData: LoaderData = {
			pref,
		};
		return loaderData;
	};
