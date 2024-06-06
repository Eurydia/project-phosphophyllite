import { LoaderFunction } from "react-router";
import { getPrefRepo } from "resources/pref";
import { RepoQueryPref } from "~types/schema";

export type LoaderData = {
	pref: RepoQueryPref;
};
export const loader: LoaderFunction =
	async () => {
		const pref = await getPrefRepo();
		const loaderData: LoaderData = {
			pref,
		};
		return loaderData;
	};
