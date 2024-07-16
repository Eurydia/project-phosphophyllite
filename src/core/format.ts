import moment from "moment";
import { AppIssue } from "~types/models";

export const formatTimeSince = (
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

export const formatDateString = (
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

export const formatTimestamp = (
	dateString: string | undefined | null,
) =>
	`${formatDateString(
		dateString,
	)} (${formatTimeSince(dateString)})`;

export const formatAppIssueToListItem = (
	issue: AppIssue,
): { label: string; value: string } => {
	const { number, title, user_type } = issue;

	const automatedTag =
		user_type === "Bot" ? "[Automated]" : "";
	return {
		label: `#${number}`,
		value: `${title} ${automatedTag}`,
	};
};
