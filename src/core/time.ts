import moment from "moment";

export const timeSince = (
	dateString: string | undefined,
	fallback: string,
) => {
	try {
		return moment(dateString).fromNow();
	} catch (err) {
		console.warn(err);
		return fallback;
	}
};

export const normalizeDateString = (
	dateString: string | undefined | null,
	fallback: string = "-",
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
