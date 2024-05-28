import { useState } from "react";
import { RepoQuery } from "~types/query";

export const useRepoQuery = (init: RepoQuery) => {
	const [query, setQuery] = useState(init);
	const setName = (value: string) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["name"] = value;
			return next;
		});
	};
	const setTopics = (value: string[]) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["topics"] = value;
			return next;
		});
	};
	const setStatus = (value: string) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["status"] =
				value as RepoQuery["status"];
			return next;
		});
	};
	const setVisibility = (value: string) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["visibility"] =
				value as RepoQuery["visibility"];
			return next;
		});
	};
	const setTopicMatchStrategy = (
		value: string,
	) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["topicMatchStrategy"] =
				value as RepoQuery["topicMatchStrategy"];
			return next;
		});
	};
	return {
		query,
		setName,
		setTopics,
		setStatus,
		setVisibility,
		setTopicMatchStrategy,
	};
};
