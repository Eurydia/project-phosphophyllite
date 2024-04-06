import moment from "moment";

export const timeSince = (dateString: string) => {
	return moment(dateString).fromNow();
};

export const toISOtoLocaleDateString = (
	dateString: string,
) => {
	return new Date(dateString).toUTCString();
};
