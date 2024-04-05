export * from "./markdown";
export * from "./query";

import moment from "moment";
export const toISOtoLocaleDateString = (
	dateString: string | undefined | null,
) => {
	if (
		dateString === undefined ||
		dateString === null
	) {
		return "";
	}
	const d = new Date(dateString);
	const delta = moment(dateString).fromNow();
	return `${d.toUTCString()} (${delta})`;
};
