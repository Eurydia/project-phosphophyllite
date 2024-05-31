export const jsonParseDefault = <T extends {}>(
	jsonString: string,
	fallback: T,
): T => {
	try {
		const jsonObj: Partial<T> =
			JSON.parse(jsonString);
		const data: T = {
			...fallback,
		};
		for (const key of Object.keys(fallback)) {
			const _k = key as keyof T;
			const _v = jsonObj[_k];
			if (_v !== undefined) {
				data[_k] = _v!;
			}
		}
		return data;
	} catch (error) {
		return fallback;
	}
};
