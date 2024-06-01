import { useRef } from "react";
import { SelectOption } from "~types/generic";

export const useRepoQueryOptions = () => {
	const { current: visibilityOptions } = useRef<
		SelectOption<string>[]
	>([
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
	]);

	const { current: statusOptions } = useRef<
		SelectOption<string>[]
	>([
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
	]);

	return {
		statusOptions,
		visibilityOptions,
	};
};
