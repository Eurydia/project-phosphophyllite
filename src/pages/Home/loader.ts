import { LoaderFunction } from "react-router-dom";
import {
	extractFilterTags,
	sortItems,
} from "~core/query";
import {
	getProjectAll,
	getTagsAll,
} from "~database";
import { SortRule } from "~types/generics";
import { ProjectSchema } from "~types/schemas";

export const sortRules: SortRule<ProjectSchema>[] =
	[
		{
			value: "lastModified",
			label: "Last modified (0-9)",
			compareFn: (a, b) =>
				b.lastModified.getTime() -
				a.lastModified.getTime(),
		},
		{
			value: "name",
			label: "Name (A-Z)",
			compareFn: (a, b) =>
				a.name.localeCompare(b.name),
		},
	];

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
	const projects = await getProjectAll();
	const url = new URL(request.url);

	const tagOptions = await getTagsAll();
	const filterTags = extractFilterTags(url);
	const sortRule =
		url.searchParams.get("sortRule");
	sortItems(sortRule, sortRules, projects);
	return {
		sortRule,
		projects,
		filterTags,
		tagOptions,
	};
};
