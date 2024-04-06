import moment from "moment";

export const timeSince = (dateString: string) => {
	return moment(dateString).fromNow();
};

export const normalizeDateString = (
	dateString: string,
) => {
	return moment(dateString).format(
		"dddd, MMMM Do YYYY, kk:mm:ss",
	);
};

export const toTimeStamp = (
	dateString: string,
) => {
	const timeAt = normalizeDateString(dateString);
	const delta = timeSince(dateString);
	return `${timeAt} (${delta})`;
};
