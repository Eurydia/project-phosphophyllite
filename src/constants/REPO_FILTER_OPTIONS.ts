import { GenericSelectOptions } from "~types/generics";

export const REPO_FILTER_PREF_CUSTOM_PREFIX =
	"repo-filter-pref-custom-prefix";

export const REPO_FILTER_PREF_TOPIC_MATCH_STRATEGY_KEY =
	"repo-filter-pref-topic-match-strategy";
export const REPO_FILTER_PREF_VISIBILITY_KEY =
	"repo-filter-pref-visibility";
export const REPO_FILTER_PREF_STATUS_KEY =
	"repo-filter-pref-status";

export const REPO_FILTER_TOPIC_MATCH_STRATEGY_OPTIONS: GenericSelectOptions<string>[] =
	[
		{
			label: "Match all",
			value: "Match all",
		},
		{
			label: "Match any",
			value: "Match any",
		},
	];

export const REPO_FILTER_VISIBILITY_OPTIONS: GenericSelectOptions<string>[] =
	[
		{
			label: "All",
			value: "All",
		},
		{
			label: "Private",
			value: "Private",
		},
		{
			label: "Public",
			value: "Public",
		},
	];

export const REPO_FILTER_STATUS_OPTIONS: GenericSelectOptions<string>[] =
	[
		{
			label: "All",
			value: "All",
		},
		{
			label: "Active",
			value: "Active",
		},
		{
			label: "Archived",
			value: "Archived",
		},
	];
