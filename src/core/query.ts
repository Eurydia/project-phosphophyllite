import {
	URLSearchParamsInit,
	createSearchParams,
} from "react-router-dom";
import { SortRule } from "~types/generics";

export const sortItems = <T>(
	rule: string | null,
	sortRules: SortRule<T>[],
	items: T[],
) => {
	if (sortRules.length <= 0) {
		return;
	}
	let compareFn = sortRules[0].compareFn;
	if (!rule) {
		for (const sortRule of sortRules) {
			if (sortRule.value === rule) {
				compareFn = sortRule.compareFn;
				break;
			}
		}
	}
	items.sort(compareFn);
};

export const extractFilterTags = (
	queryString: string | null,
): string[] => {
	let filterTags: string[] = [];
	if (queryString) {
		filterTags = queryString
			.normalize()
			.split(",");
	}
	return filterTags;
};

export const toSearchParam = (
	query: URLSearchParamsInit,
) => {
	return createSearchParams(query).toString();
};
