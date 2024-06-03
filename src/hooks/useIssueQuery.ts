import { useState } from "react";
import { IssueQuery } from "~types/query";

export const useIssueQuery = (
	init: IssueQuery,
) => {
	const [query, setQuery] = useState(init);
	const setTitle = (value: string) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["title"] = value;
			return next;
		});
	};
	const setState = (
		value: IssueQuery["state"],
	) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["state"] = value;
			return next;
		});
	};
	const setOwnerType = (
		value: IssueQuery["ownerType"],
	) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["ownerType"] = value;
			return next;
		});
	};
	const setSortBy = (
		value: IssueQuery["sortBy"],
	) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["sortBy"] = value;
			return next;
		});
	};
	const setSortOrder = (
		value: IssueQuery["sortOrder"],
	) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["sortOrder"] = value;
			return next;
		});
	};
	return {
		query,
		setOwnerType,
		setState,
		setTitle,
		setSortBy,
		setSortOrder,
	};
};
