export const orderByString = (
	a: string | null | undefined,
	b: string | null | undefined,
): number => {
	if (a === null || b === null) {
		return 0;
	}
	if (a === undefined || b === undefined) {
		return 0;
	}
	return b.localeCompare(a);
};

export const orderByBoolean = (
	a: boolean | null | undefined,
	b: boolean | null | undefined,
) => {
	const a_ = Boolean(a);
	const b_ = Boolean(b);
	if (a_ === b_) {
		return 0;
	}
	if (a_ && !b_) {
		return -1;
	}
	return 1;
};

export const orderByNumber = (
	a: number | null | undefined,
	b: number | null | undefined,
) => {
	if (a === null || b === null) {
		return 0;
	}
	if (a === undefined || b === undefined) {
		return 0;
	}

	return b - a;
};
