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
	const setRepoFullNames = (value: string[]) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["repoFullNames"] = value;
			return next;
		});
	};
	const setState = (value: string) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["state"] =
				value as IssueQuery["state"];
			return next;
		});
	};
	const setOwnerType = (value: string) => {
		setQuery((prev) => {
			const next = { ...prev };
			next["ownerType"] =
				value as IssueQuery["ownerType"];
			return next;
		});
	};
	return {
		query,
		setOwnerType,
		setRepoFullNames,
		setState,
		setTitle,
	};
};
