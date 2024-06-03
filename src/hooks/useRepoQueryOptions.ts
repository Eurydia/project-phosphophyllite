import { useRef } from "react";
import { SelectOption } from "~types/generic";
import { RepoQuery } from "~types/query";

export const useRepoQueryOptions = () => {
	const { current: sortOrderOptions } = useRef<
		SelectOption<RepoQuery["sortOrder"]>[]
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

	const { current: visibilityOptions } = useRef<
		SelectOption<RepoQuery["visibility"]>[]
	>([
		{
			label: "All",
			value: "all",
		},
		{
			label: "Private",
			value: "private",
		},
		{
			label: "Public",
			value: "public",
		},
	]);
	const { current: sortByOptions } = useRef<
		SelectOption<RepoQuery["sortBy"]>[]
	>([
		{
			label: "Full name",
			value: "fullName",
		},
		{
			label: "Time since created",
			value: "createdAt",
		},
		{
			label: "Time since last updated",
			value: "updatedAt",
		},
		{
			label: "Time since last pushed",
			value: "pushedAt",
		},
	]);
	const { current: statusOptions } = useRef<
		SelectOption<RepoQuery["status"]>[]
	>([
		{
			label: "All",
			value: "all",
		},
		{
			label: "Active",
			value: "active",
		},
		{
			label: "Archived",
			value: "archived",
		},
	]);
	return {
		statusOptions,
		visibilityOptions,
		sortByOptions,
		sortOrderOptions,
	};
};
