export const getRepoFilterName = (): string => {
	const data = localStorage.getItem(
		"repo-filter-name",
	);
	if (data !== null) {
		return data;
	}
	return "";
};

export const getRepoFilterTopics =
	(): string[] => {
		const data = localStorage.getItem(
			"repo-filter-topics",
		);
		if (data !== null) {
			return JSON.parse(data);
		}

		return [];
	};

export const getRepoFilterVisibility =
	(): string => {
		const data = localStorage.getItem(
			"repo-filter-visibility",
		);
		if (data !== null) {
			return data;
		}
		return "All";
	};

export const getRepoFilterStatus = (): string => {
	const data = localStorage.getItem(
		"repo-filter-status",
	);
	if (data !== null) {
		return data;
	}
	return "All";
};

export const getRepoFilterTopicMode = () => {
	const data = localStorage.getItem(
		"repo-filter-topic-mode",
	);
	if (data !== null) {
		return data;
	}
	return "Match all";
};
