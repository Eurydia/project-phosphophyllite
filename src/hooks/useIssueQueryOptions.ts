import { useRef } from "react";
import { SelectOption } from "~types/generic";
import { IssueQuery } from "~types/query";

export const useIssueQueryOptions = () => {
	const { current: sortOrderOptions } = useRef<
		SelectOption<IssueQuery["sortOrder"]>[]
	>([
		{
			label: "Ascending",
			value: "asc",
		},
		{
			label: "Descending",
			value: "desc",
		},
	]);
	const { current: sortByOptions } = useRef<
		SelectOption<IssueQuery["sortBy"]>[]
	>([
		{
			label: "Title",
			value: "title",
		},
		{
			label: "Time since created",
			value: "createdAt",
		},
		{
			label: "Time since last updated",
			value: "updatedAt",
		},
	]);
	const { current: ownerTypeOptions } = useRef<
		SelectOption<IssueQuery["ownerType"]>[]
	>([
		{
			label: "All",
			value: "all",
		},
		{
			label: "Bot",
			value: "bot",
		},
		{
			label: "User",
			value: "user",
		},
	]);
	const { current: stateOptions } = useRef<
		SelectOption<IssueQuery["state"]>[]
	>([
		{
			label: "All",
			value: "all",
		},
		{
			label: "Open",
			value: "open",
		},
		{
			label: "Closed",
			value: "closed",
		},
	]);

	return {
		stateOptions,
		ownerTypeOptions,
		sortByOptions,
		sortOrderOptions,
	};
};
