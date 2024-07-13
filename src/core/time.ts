import moment from "moment";

export const timeSince = (
	dateString: string | null | undefined,
	fallback: string = "unknown",
) => {
	if (!dateString) {
		return fallback;
	}
	try {
		return moment(dateString).fromNow();
	} catch (err) {
		console.warn(err);
		return fallback;
	}
};

export const normalizeDateString = (
	dateString: string | undefined | null,
	fallback: string = "unknown",
) => {
	if (
		dateString === undefined ||
		dateString === null ||
		dateString === ""
	) {
		return fallback;
	}

	return moment(dateString).format(
		"MMMM Do, YYYY",
	);
};

export const normalizeDateStringWithTimestamp = (
	dateString: string | undefined | null,
) =>
	`${normalizeDateString(
		dateString,
	)} (${timeSince(dateString)})`;
