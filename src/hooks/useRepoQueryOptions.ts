import { useRef } from "react";
import { SelectOption } from "~types/generic";
import { RepoQuery } from "~types/query";

export const useRepoQueryOptions = () => {
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
			label: "Date created",
			value: "createdAt",
		},
		{
			label: "Last updated",
			value: "updatedAt",
		},
		{
			label: "Last pushed",
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
	};
};
