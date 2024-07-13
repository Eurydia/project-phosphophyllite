export const tryDecodeBase64 = (
	content: string,
): string => {
	try {
		return window.atob(content);
	} catch (error) {
		return "";
	}
};
