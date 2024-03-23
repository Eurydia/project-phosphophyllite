import { SortRule } from "~types/generics";

export const sortItems = <T>(
	rule: string | null,
	sortRules: SortRule<T>[],
	items: T[],
) => {
	if (rule === null) {
		return;
	}
	if (sortRules.length <= 0) {
		return;
	}
	let compareFn = sortRules[0].compareFn;
	for (const sortRule of sortRules) {
		if (sortRule.value === rule) {
			compareFn = sortRule.compareFn;
			break;
		}
	}
	items.sort(compareFn);
};

export const extractFilterTags = (
	url: URL,
): string[] => {
	const tagsParam = url.searchParams.get("tags");
	let filterTags: string[] = [];
	if (tagsParam) {
		filterTags = tagsParam.normalize().split(",");
	}
	return filterTags;
};
