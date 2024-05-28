import {
	ISSUE_FILTER_PREF_OWNER_TYPE_KEY,
	ISSUE_FILTER_PREF_STATE_KEY,
	REPO_FILTER_PREF_STATUS_KEY,
	REPO_FILTER_PREF_TOPIC_MATCH_STRATEGY_KEY,
	REPO_FILTER_PREF_VISIBILITY_KEY,
} from "~constants";
import {
	IssueQuery,
	RepoQuery,
} from "~types/query";

/////////////////////////////////////////////
// Repo filter preferences

export const getRepoFilterPrefVisibility =
	(): RepoQuery["visibility"] => {
		const data = localStorage.getItem(
			REPO_FILTER_PREF_VISIBILITY_KEY,
		);
		if (data !== null) {
			return data as RepoQuery["visibility"];
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
export const getRepoQueryStatus =
	(): RepoQuery["status"] => {
		const data = localStorage.getItem(
			REPO_FILTER_PREF_STATUS_KEY,
		);
		if (data !== null) {
			return data as RepoQuery["status"];
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
	(): RepoQuery["topicMatchStrategy"] => {
		const data = localStorage.getItem(
			REPO_FILTER_PREF_TOPIC_MATCH_STRATEGY_KEY,
		);
		if (data !== null) {
			return data as RepoQuery["topicMatchStrategy"];
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

/////////////////////////////////////////////
// Issues filter preferences
export const getIssueFilterPrefState =
	(): IssueQuery["state"] => {
		const data = localStorage.getItem(
			ISSUE_FILTER_PREF_STATE_KEY,
		);
		if (data !== null) {
			return data as IssueQuery["state"];
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
	(): IssueQuery["ownerType"] => {
		const data = localStorage.getItem(
			"issue-filter-pref-owner-type",
		);
		if (data !== null) {
			return data as IssueQuery["ownerType"];
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
