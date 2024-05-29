import { useRef } from "react";
import { SelectOption } from "~types/generic";

export const useRepoQueryOptions = () => {
	const topicMatchStrategyOptions = useRef<
		SelectOption<string>[]
	>([
		{
			label: "Match all",
			value: "Match all",
		},
		{
			label: "Match any",
			value: "Match any",
		},
	]);

	const visibilityOptions = useRef<
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

	const statusOptions = useRef<
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
		statusOptions: statusOptions.current,
		topicMatchStrategyOptions:
			topicMatchStrategyOptions.current,
		visibilityOptions: visibilityOptions.current,
	};
};
