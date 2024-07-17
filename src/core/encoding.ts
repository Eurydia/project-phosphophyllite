export const tryDecodeBase64 = (
	content: string,
): string => {
	try {
		return window.atob(content);
	} catch (error) {
		return "";
	}
};

export const encodeBase64 = (
	content: string,
): string => window.btoa(content);
