export const tryParseJSON = <T, V>(
	jsonString: string,
	fallback: V,
): T | V => {
	try {
		return JSON.parse(jsonString);
	} catch (err) {
		return fallback;
	}
};
