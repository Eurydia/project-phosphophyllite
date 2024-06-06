import { useState } from "react";
import {
	RepoQuery,
	RepoQueryPref,
} from "~types/schema";
import { useRepoQueryPreference } from "./useRepoQueryPreference";

export const useRepoQueryForm = (
	init: RepoQueryPref,
) => {
	const {
		pref,
		setSortBy,
		setSortOrder,
		setStatus,
		setVisibility,
	} = useRepoQueryPreference(init);
	const [fullName, setFullName] = useState("");

	const query: RepoQuery = {
		fullName,
		...pref,
	};
	return {
		query,
		setFullName,
		setStatus,
		setVisibility,
		setSortBy,
		setSortOrder,
	};
};
