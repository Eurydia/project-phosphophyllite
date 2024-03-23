import { LoaderFunction } from "react-router";
import { getTagsAll } from "~database/index";

export const loaderProjectCreate: LoaderFunction =
	async () => {
		document.title = "New project";

		return await getTagsAll();
	};
