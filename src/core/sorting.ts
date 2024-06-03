import { RepoQuery } from "~types/query";
import {
	IssueSchema,
	RepoSchema,
} from "~types/schema";

export const sortByString = (
	a: string | null | undefined,
	b: string | null | undefined,
): number => {
	const _a = !!a ? 1 : 0;
	const _b = !!b ? 1 : 0;
	if (_a + _b !== 2) {
		return _b - _a;
	}
	return a!.localeCompare(b!);
};

export const sortByBoolean = (
	a: boolean | null | undefined,
	b: boolean | null | undefined,
) => {
	const _a = !!a ? 1 : 0;
	const _b = !!b ? 1 : 0;
	return _b - _a;
};
export const sortByNumber = (
	a: number | null | undefined,
	b: number | null | undefined,
) => {
	const _a = !!a ? 1 : 0;
	const _b = !!b ? 1 : 0;
	if (_a + _b < 2) {
		return _b - _a;
	}
	return b! - a!;
};

export const getIssueSortFn = (
	property: keyof IssueSchema,
) => {
	let orderFn:
		| ((a: IssueSchema, b: IssueSchema) => number)
		| undefined;
	switch (property) {
		case "issueNumber":
			orderFn = (a, b) => {
				return sortByNumber(
					a[property] as
						| number
						| undefined
						| null,
					b[property] as
						| number
						| undefined
						| null,
				);
			};
			break;
		case "title":
		case "repoFullName":
		case "ownerType":
		case "state":
		case "createdAt":
		case "updatedAt":
			orderFn = (a, b) => {
				return sortByString(
					a[property] as
						| string
						| undefined
						| null,
					b[property] as
						| string
						| undefined
						| null,
				);
			};
	}
	return orderFn;
};

const getRepoSortFn = (
	property: keyof RepoSchema,
):
	| ((a: RepoSchema, b: RepoSchema) => number)
	| undefined => {
	switch (property) {
		case "fullName":
			return (a, b) =>
				sortByString(a[property], b[property]);
		case "pushedAt":
		case "createdAt":
		case "updatedAt":
			return (a, b) =>
				sortByString(b[property], a[property]);
	}
	return undefined;
};

export const sortRepos = (
	repos: RepoSchema[],
	query: RepoQuery,
): void => {
	const { sortOrder, sortBy } = query;
	const sortFn = getRepoSortFn(sortBy);
	if (sortFn === undefined) {
		return;
	}
	repos.sort(sortFn);
	if (sortOrder === "desc") {
		repos.reverse();
	}
};
