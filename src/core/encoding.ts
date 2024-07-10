export const tryDecodeBase64 = (
	content: string,
): string | null => {
	try {
		return window.atob(content);
	} catch (error) {
		return null;
	}
};
