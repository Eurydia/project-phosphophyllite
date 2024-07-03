import { useState } from "react";
import { IssueQueryPreference } from "~types/schema";

export const useIssueQueryPreference = (
	initPref: IssueQueryPreference,
) => {
	const [pref, setPref] =
		useState<IssueQueryPreference>(initPref);
	const setState = (
		value: IssueQueryPreference["state"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["state"] = value;
			return next;
		});
	};
	const setOwnerType = (
		value: IssueQueryPreference["ownerType"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["ownerType"] = value;
			return next;
		});
	};
	const setSortBy = (
		value: IssueQueryPreference["sortBy"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["sortBy"] = value;
			return next;
		});
	};
	const setSortOrder = (
		value: IssueQueryPreference["sortOrder"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["sortOrder"] = value;
			return next;
		});
	};
	return {
		pref,
		setState,
		setSortBy,
		setSortOrder,
		setOwnerType,
	};
};
