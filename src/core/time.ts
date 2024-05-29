import moment from "moment";

export const timeSince = (dateString: string) => {
	return moment(dateString).fromNow();
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
