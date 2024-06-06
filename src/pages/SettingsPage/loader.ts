import { LoaderFunction } from "react-router";
import { getDataMisc } from "resources/data";
import { MiscData } from "~types/schema";

export type LoaderData = {
	miscData: MiscData;
};
export const loader: LoaderFunction =
	async () => {
		const miscData = await getDataMisc();
		const loaderData: LoaderData = {
			miscData,
		};
		return loaderData;
	};
