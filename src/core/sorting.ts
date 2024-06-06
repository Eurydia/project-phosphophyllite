import {
	IssueQuery,
	IssueSchema,
	RepoQuery,
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

const getIssueSortFn = (
	property: keyof IssueSchema,
):
	| ((a: IssueSchema, b: IssueSchema) => number)
	| undefined => {
	switch (property) {
		case "issueNumber":
			return (a, b) => {
				return sortByNumber(
					a[property],
					b[property],
				);
			};
		case "title":
			return (a, b) => {
				return sortByString(
					a[property],
					b[property],
				);
			};
		case "createdAt":
		case "updatedAt":
			return (a, b) => {
				return sortByString(
					b[property],
					a[property],
				);
			};
	}
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

export const sortIssues = (
	issues: IssueSchema[],
	query: IssueQuery,
): void => {
	const { sortOrder, sortBy } = query;
	const sortFn = getIssueSortFn(sortBy);
	if (sortFn === undefined) {
		return;
	}
	issues.sort(sortFn);
	if (sortOrder === "desc") {
		issues.reverse();
	}
};
