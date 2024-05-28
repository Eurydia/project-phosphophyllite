import { useState } from "react";
import {
	ISSUE_FILTER_PREF_OWNER_TYPE_KEY,
	ISSUE_FILTER_PREF_STATE_KEY,
} from "~constants";

export const useIssueQueryPreference = () => {
	const [state] = useState((): string => {
		const data = localStorage.getItem(
			ISSUE_FILTER_PREF_STATE_KEY,
		);
		if (data !== null) {
			return data;
		}
		return "All";
	});
	const [ownerType] = useState((): string => {
		const data = localStorage.getItem(
			ISSUE_FILTER_PREF_OWNER_TYPE_KEY,
		);
		if (data !== null) {
			return data;
		}
		return "User";
	});
	return { ownerType, state };
};
