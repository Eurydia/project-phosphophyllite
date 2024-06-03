import { useState } from "react";
import { RepoQuery } from "~types/query";

export const useRepoQueryForm = (
	init: RepoQuery,
) => {
	const [query, setQuery] = useState(init);
	const setFullName = (value: string) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["fullName"] = value;
			return next;
		});
	};
	const setStatus = (
		value: RepoQuery["status"],
	) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["status"] = value;
			return next;
		});
	};
	const setVisibility = (
		value: RepoQuery["visibility"],
	) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["visibility"] = value;
			return next;
		});
	};
	const setSortBy = (
		value: RepoQuery["sortBy"],
	) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["sortBy"] = value;
			return next;
		});
	};
	return {
		query,
		setFullName,
		setStatus,
		setVisibility,
		setSortBy,
	};
};
