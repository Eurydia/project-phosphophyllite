import { useRef } from "react";
import { SelectOption } from "~types/generic";

export const useIssueQueryOptions = () => {
	const ownerTypeOptions = useRef<
		SelectOption<string>[]
	>([
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
	]);

	const stateOptions = useRef<
		SelectOption<string>[]
	>([
		{
			label: "All",
			value: "All",
		},
		{
			label: "Open",
			value: "Open",
		},
		{
			label: "Closed",
			value: "Closed",
		},
	]);

	return {
		stateOptions: stateOptions.current,
		ownerTypeOptions: ownerTypeOptions.current,
	};
};
