import { LoaderFunction } from "react-router";
import { GenericAppData } from "~types/schema";

export type LoaderData = {
	miscData: GenericAppData;
};
export const loader: LoaderFunction =
	async () => {
		// 	const miscData = await getDataMisc();
		// 	const loaderData: LoaderData = {
		// 		miscData,
		// 	};
		// 	return loaderData;
		return null;
	};
