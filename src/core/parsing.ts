export const tryParse = (
	json_string: string,
): unknown | null => {
	try {
		return JSON.parse(json_string);
	} catch (err) {
		console.warn(err);
		return null;
	}
};
