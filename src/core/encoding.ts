export const tryDecodeBase64 = (
	content: string,
	fallback: string = "",
): string => {
	if (content.trim() === "") {
		return fallback;
	}
	try {
		return window.atob(content);
	} catch (error) {
		return fallback;
	}
};

export const encodeBase64 = (
	content: string,
): string => window.btoa(content);
