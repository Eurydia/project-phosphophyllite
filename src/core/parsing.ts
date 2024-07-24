export const tryParse = <T>(
	jsonString: string,
): T | null => {
	try {
		return JSON.parse(jsonString);
	} catch (err) {
		console.warn(err);
		return null;
	}
};
