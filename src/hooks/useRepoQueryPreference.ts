import { useEffect, useState } from "react";
import {
	getRepoQueryPreference,
	setRepoQueryPreference,
} from "resources/settings";
import {
	RepoQuery,
	RepoQueryPref,
} from "~types/query";

export const useRepoQueryPreference = () => {
	const [pref, setPref] = useState<
		RepoQueryPref | undefined
	>();

	useEffect(() => {
		(async () => {
			const cPref =
				await getRepoQueryPreference();
			setPref(cPref);
		})();
	}, []);

	useEffect(() => {
		if (pref === undefined) {
			return;
		}
		setRepoQueryPreference(pref);
	}, [pref]);

	const setStatus = (
		value: RepoQuery["status"],
	) => {
		setPref((prev) => {
			if (prev === undefined) {
				return;
			}
			const next = { ...prev };
			next["status"] = value;
			return next;
		});
	};
	const setVisibility = (
		value: RepoQuery["visibility"],
	) => {
		setPref((prev) => {
			if (prev === undefined) {
				return;
			}
			const next = { ...prev };
			next["visibility"] = value;
			return next;
		});
	};
	return {
		pref,
		setStatus,
		setVisibility,
	};
};
