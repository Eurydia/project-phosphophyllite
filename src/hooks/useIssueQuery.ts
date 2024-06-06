import { useState } from "react";
import { IssueQuery } from "~types/schema";
import { useIssueQueryPreference } from "./useIssueQueryPreference";

export const useIssueQuery = (
	init: IssueQuery,
) => {
	const {
		pref,
		setOwnerType,
		setSortBy,
		setSortOrder,
		setState,
	} = useIssueQueryPreference(init);
	const [title, setTitle] = useState(init.title);
	const query: IssueQuery = {
		title,
		...pref,
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
