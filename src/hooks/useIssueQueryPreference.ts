import { useState } from "react";
import { IssueQueryPref } from "~types/schema";

export const useIssueQueryPreference = (
	initPref: IssueQueryPref,
) => {
	const [pref, setPref] =
		useState<IssueQueryPref>(initPref);
	const setState = (
		value: IssueQueryPref["state"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["state"] = value;
			return next;
		});
	};
	const setOwnerType = (
		value: IssueQueryPref["ownerType"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["ownerType"] = value;
			return next;
		});
	};
	const setSortBy = (
		value: IssueQueryPref["sortBy"],
	) => {
		setPref((prev) => {
			const next = { ...prev };
			next["sortBy"] = value;
			return next;
		});
	};
	const setSortOrder = (
		value: IssueQueryPref["sortOrder"],
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
