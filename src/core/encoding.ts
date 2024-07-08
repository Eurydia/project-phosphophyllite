import { Buffer } from "buffer";

export const decodeBase64 = (content: string) => {
	if (content === "") {
		return "";
	}
	const decoded = Buffer.from(
		content,
		"base64",
	).toString();
	return decoded;
};
