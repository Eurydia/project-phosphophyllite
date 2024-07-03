import { useState } from "react";
import { RepositoryQueryPreference } from "~types/schema";

export const useRepoQueryPreference = (
	init: RepositoryQueryPreference,
) => {
	const [pref, setPref] =
		useState<RepositoryQueryPreference>(init);

	const setStatus = (
		value: RepositoryQueryPreference["status"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["status"] = value;
			return next;
		});
	};
	const setVisibility = (
		value: RepositoryQueryPreference["visibility"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["visibility"] = value;
			return next;
		});
	};
	const setSortBy = (
		value: RepositoryQueryPreference["sortBy"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["sortBy"] = value;
			return next;
		});
	};
	const setSortOrder = (
		value: RepositoryQueryPreference["sortOrder"],
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
