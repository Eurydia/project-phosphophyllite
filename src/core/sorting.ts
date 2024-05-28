import {
	IssueSchema,
	RepoSchema,
} from "~types/schemas";

export const sortByString = (
	a: string | null | undefined,
	b: string | null | undefined,
): number => {
	// moves nullish values to the end
	const _a = !!a ? 1 : 0;
	const _b = !!b ? 1 : 0;
	if (_a + _b !== 2) {
		return _b - _a;
	}
	// if (!_a && _b) {
	// 	return 1;
	// }
	// if (!_a && !_b) {
	// 	return 0;
	// }
	// if (_a && !_b) {
	// 	return -1;
	// }
	return b!.localeCompare(a!);
};

export const sortByBoolean = (
	a: boolean | null | undefined,
	b: boolean | null | undefined,
) => {
	const _a = !!a ? 1 : 0;
	const _b = !!b ? 1 : 0;
	return _b - _a;
	// if (_a === _b) {
	// 	return 0;
	// }
	// if (_a && !_b) {
	// 	return -1;
	// }
	// return 1;
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
	// if (!_a && _b) {
	// 	return 1;
	// }
	// if (!_a && !_b) {
	// 	return 0;
	// }
	// if (_a && !_b) {
	// 	return -1;
	// }
	return b! - a!;
};

export const getIssueOrderingFn = (
	property: keyof IssueSchema,
) => {
	let orderFn:
		| ((a: IssueSchema, b: IssueSchema) => number)
		| undefined;
	switch (property) {
		case "issue_number":
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
		case "repo_full_name":
		case "owner_type":
		case "state":
		case "created_at":
		case "updated_at":
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

export const getRepoOrderingFn = (
	property: keyof RepoSchema,
):
	| ((a: RepoSchema, b: RepoSchema) => number)
	| undefined => {
	switch (property) {
		case "is_archived":
		case "is_private":
			return (a, b) =>
				sortByBoolean(
					a[property] as
						| boolean
						| undefined
						| null,
					b[property] as
						| boolean
						| undefined
						| null,
				);
		case "full_name":
		case "pushed_at":
		case "created_at":
		case "updated_at":
			return (a, b) =>
				sortByString(
					a[property] as
						| string
						| undefined
						| null,
					b[property] as
						| string
						| undefined
						| null,
				);
	}
	return undefined;
};
