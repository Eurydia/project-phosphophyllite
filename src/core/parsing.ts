export const tryParse = (
	jsonString: string,
): unknown | null => {
	try {
		return JSON.parse(jsonString);
	} catch (err) {
		console.warn(err);
		return null;
	}
};
