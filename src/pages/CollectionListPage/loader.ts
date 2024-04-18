import { LoaderFunction } from "react-router-dom";
import { getCollections } from "~database/index";
import { CollectionSchema } from "~types/schemas";

export type LoaderData = {
	collections: CollectionSchema[];
};
export const loader: LoaderFunction =
	async (): Promise<LoaderData> => {
		document.title = "collections";
		const collections = await getCollections();
		const loaderData: LoaderData = {
			collections,
		};
		return loaderData;
	};
