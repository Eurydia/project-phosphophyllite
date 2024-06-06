import { useEffect, useState } from "react";
import { setPrefRepo } from "resources/pref";
import { RepoQueryPref } from "~types/schema";

export const useRepoQueryPreference = (
	init: RepoQueryPref,
) => {
	const [pref, setPref] =
		useState<RepoQueryPref>(init);

	useEffect(() => {
		setPrefRepo(pref);
	}, [pref]);

	const setStatus = (
		value: RepoQueryPref["status"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["status"] = value;
			return next;
		});
	};
	const setVisibility = (
		value: RepoQueryPref["visibility"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["visibility"] = value;
			return next;
		});
	};
	const setSortBy = (
		value: RepoQueryPref["sortBy"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["sortBy"] = value;
			return next;
		});
	};
	const setSortOrder = (
		value: RepoQueryPref["sortOrder"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["sortOrder"] = value;
			return next;
		});
	};
	return {
		pref,
		setStatus,
		setVisibility,
		setSortBy,
		setSortOrder,
	};
};
