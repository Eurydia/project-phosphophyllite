import { LoaderFunction } from "react-router-dom";
import {
	getProjectAll,
	getTagsAll,
} from "~database";
import { ProjectSchema } from "~types/schemas";

export const sortRules = [
	{
		value: "lastModified",
		label: "Last modified (0-9)",
	},
	{ value: "name", label: "Name (A-Z)" },
];

const sortByString = (a: string, b: string) => {
	return a.localeCompare(b);
};

const sortByNumber = (a: number, b: number) => {
	return a - b;
};

export type LoaderData = {
	tagOptions: string[];
	filterTags: string[];
	sortRule: string | null;
	projects: ProjectSchema[];
};

export const loaderHome: LoaderFunction = async ({
	request,
}) => {
	document.title = "Projects";
	let projects = await getProjectAll();

	const url = new URL(request.url);

	const tagsParam = url.searchParams.get("tags");
	let filterTags: string[] = [];
	if (tagsParam) {
		filterTags = tagsParam.normalize().split(",");
	}
	if (filterTags.length > 0) {
		projects = projects.filter((project) =>
			filterTags.every((tag) =>
				project.tags.includes(tag),
			),
		);
	}

	const sortRule =
		url.searchParams.get("sortRule");
	switch (sortRule) {
		case "name":
			projects.sort((a, b) =>
				sortByString(a.name, b.name),
			);
			break;
		case "":
		case null:
		case "lastModified":
		default:
			projects.sort((a, b) =>
				sortByNumber(
					b.lastModified.getTime(),
					a.lastModified.getTime(),
				),
			);
			break;
	}

	const tagOptions = await getTagsAll();

	return {
		sortRule,
		projects,
		filterTags,
		tagOptions,
	};
};
