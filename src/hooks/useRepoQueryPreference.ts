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

	const setStatus = (value: string) => {
		setPref((prev) => {
			if (prev === undefined) {
				return;
			}
			const next = { ...prev };
			next["status"] =
				value as RepoQuery["status"];
			return next;
		});
	};
	const setVisibility = (value: string) => {
		setPref((prev) => {
			if (prev === undefined) {
				return;
			}
			const next = { ...prev };
			next["visibility"] =
				value as RepoQuery["visibility"];
			return next;
		});
	};
	const setTopicMatchStrategy = (
		value: string,
	) => {
		setPref((prev) => {
			if (prev === undefined) {
				return;
			}
			const next = { ...prev };
			next["topicMatchStrategy"] =
				value as RepoQuery["topicMatchStrategy"];
			return next;
		});
	};
	return {
		pref,
		setStatus,
		setVisibility,
		setTopicMatchStrategy,
	};
};
