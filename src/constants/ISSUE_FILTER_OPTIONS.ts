import { GenericSelectOptions } from "~types/generics";

export const ISSUE_FILTER_PREF_STATE_KEY =
	"issue-filter-pref-state";

export const ISSUE_FILTER_PREF_OWNER_TYPE_KEY =
	"issue-filter-pref-owner-type";

export const ISSUE_FILTER_STATE_OPTIONS: GenericSelectOptions<string>[] =
	[
		{
			label: "All",
			value: "All",
		},
		{
			label: "Open",
			value: "open",
		},
		{
			label: "Closed",
			value: "closed",
		},
	];

export const ISSUE_FILTER_OWNER_TYPE_OPTIONS: GenericSelectOptions<string>[] =
	[
		{
			label: "All",
			value: "All",
		},
		{
			label: "Bot",
			value: "Bot",
		},
		{
			label: "User",
			value: "User",
		},
	];
