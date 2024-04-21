import {
	ISSUE_FILTER_PREF_OWNER_TYPE_KEY,
	ISSUE_FILTER_PREF_STATE_KEY,
	REPO_FILTER_PREF_CUSTOM_PREFIX,
	REPO_FILTER_PREF_STATUS_KEY,
	REPO_FILTER_PREF_TOPIC_MATCH_STRATEGY_KEY,
	REPO_FILTER_PREF_VISIBILITY_KEY,
} from "~constants";

/////////////////////////////////////////////
// Repo filter preferences

export const getRepoFilterPrefPropertyPrefix =
	() => {
		const data = localStorage.getItem(
			REPO_FILTER_PREF_CUSTOM_PREFIX,
		);
		if (data !== null && data !== "") {
			return data;
		}
		return "phospho-";
	};
export const getRepoFilterPrefVisibility =
	(): string => {
		const data = localStorage.getItem(
			REPO_FILTER_PREF_VISIBILITY_KEY,
		);
		if (data !== null) {
			return data;
		}
		return "All";
	};
export const setRepoFilterPrefVisibility = (
	value: string,
) => {
	localStorage.setItem(
		REPO_FILTER_PREF_VISIBILITY_KEY,
		value,
	);
};
export const getRepoFilterPrefStatus =
	(): string => {
		const data = localStorage.getItem(
			REPO_FILTER_PREF_STATUS_KEY,
		);
		if (data !== null) {
			return data;
		}
		return "All";
	};
export const setRepoFilterPrefStatus = (
	value: string,
) => {
	localStorage.setItem(
		REPO_FILTER_PREF_STATUS_KEY,
		value,
	);
};
export const getRepoFilterPrefTopicMatchStrategy =
	() => {
		const data = localStorage.getItem(
			REPO_FILTER_PREF_TOPIC_MATCH_STRATEGY_KEY,
		);
		if (data !== null) {
			return data;
		}
		return "Match all";
	};
export const setRepoFilterPrefTopicMatchStrategy =
	(value: string) => {
		localStorage.setItem(
			REPO_FILTER_PREF_TOPIC_MATCH_STRATEGY_KEY,
			value,
		);
	};
export const setRepoFilterPrefCustomPrefix = (
	value: string,
) => {
	localStorage.setItem(
		REPO_FILTER_PREF_CUSTOM_PREFIX,
		value,
	);
};

/////////////////////////////////////////////
// Issues filter preferences
export const getIssueFilterPrefState =
	(): string => {
		const data = localStorage.getItem(
			ISSUE_FILTER_PREF_STATE_KEY,
		);
		if (data !== null) {
			return data;
		}
		return "All";
	};
export const setIssueFilterPrefState = (
	value: string,
) => {
	localStorage.setItem(
		ISSUE_FILTER_PREF_STATE_KEY,
		value,
	);
};
export const getIssueFilterPrefOwnerType =
	(): string => {
		const data = localStorage.getItem(
			"issue-filter-pref-owner-type",
		);
		if (data !== null) {
			return data;
		}
		return "User";
	};
export const setIssueFilterPrefOwnerType = (
	value: string,
) => {
	localStorage.setItem(
		ISSUE_FILTER_PREF_OWNER_TYPE_KEY,
		value,
	);
};
