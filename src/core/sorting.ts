export const orderByString = (
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

export const orderByBoolean = (
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

export const orderByNumber = (
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
