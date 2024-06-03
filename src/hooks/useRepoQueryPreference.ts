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
		if (pref === undefined) {
			return;
		}
		setPref((prev) => {
			const next = { ...prev! };
			next["status"] = value;
			return next;
		});
	};
	const setVisibility = (
		value: RepoQuery["visibility"],
	) => {
		if (pref === undefined) {
			return;
		}
		setPref((prev) => {
			const next = { ...prev! };
			next["visibility"] = value;
			return next;
		});
	};
	const setSort = (
		value: RepoQuery["sortBy"],
	) => {
		if (pref === undefined) {
			return;
		}
		setPref((prev) => {
			const next = { ...prev! };
			next["sortBy"] = value;
			return next;
		});
	};
	return {
		pref,
		setStatus,
		setVisibility,
		setSort,
	};
};
