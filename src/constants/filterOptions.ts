import { GenericSelectOptions } from "~types/generics";

export const FILTER_MODE_OPTIONS: GenericSelectOptions<string>[] =
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

export const FILTER_VISIBILITY_OPTIONS: GenericSelectOptions<string>[] =
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

export const FILTER_STATUS_OPTIONS: GenericSelectOptions<string>[] =
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
