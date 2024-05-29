import { useEffect, useState } from "react";
import {
	getIssueQueryPreference,
	setIssueQueryPreference,
} from "resources/settings";
import { IssueQueryPref } from "~types/query";

export const useIssueQueryPreference = () => {
	const [pref, setPref] = useState<
		IssueQueryPref | undefined
	>();

	useEffect(() => {
		(async () => {
			const cPref =
				await getIssueQueryPreference();
			setPref(cPref);
		})();
	}, []);

	useEffect(() => {
		if (pref === undefined) {
			return;
		}
		setIssueQueryPreference(pref);
	}, [pref]);

	const setState = (value: string) => {
		setPref((prev) => {
			if (prev === undefined) {
				return;
			}
			const next = { ...prev };
			next["state"] =
				value as IssueQueryPref["state"];
			return next;
		});
	};

	const setOwnerType = (value: string) => {
		setPref((prev) => {
			if (prev === undefined) {
				return;
			}
			const next = { ...prev };
			next["ownerType"] =
				value as IssueQueryPref["ownerType"];
			return next;
		});
	};
	return {
		pref,
		setState,
		setOwnerType,
	};
};
