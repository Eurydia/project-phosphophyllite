import { LoaderFunction } from "react-router";
import { getDataMisc } from "resources/data";
import { GenericAppData } from "~types/schema";

export type LoaderData = {
	miscData: GenericAppData;
};
export const loader: LoaderFunction =
	async () => {
		const miscData = await getDataMisc();
		const loaderData: LoaderData = {
			miscData,
		};
		return loaderData;
	};
