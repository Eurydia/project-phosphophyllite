import {
	LoaderFunction,
	json,
} from "react-router-dom";
import {
	extractFilterTags,
	sortItems,
} from "~core/query";
import {
	getProject,
	getTagsAll,
	getTicketAll,
} from "~database";
import { SortRule } from "~types/generics";
import { TicketSchema } from "~types/schemas";

export const sortRules: SortRule<TicketSchema>[] =
	[
		{
			value: "lastModified",
			label: "Last modified (0-9)",
			compareFn: (a, b) =>
				b.lastModified.getTime() -
				a.lastModified.getTime(),
		},
		{
			value: "title",
			label: "Title (A-Z)",
			compareFn: (a, b) =>
				a.title.localeCompare(b.title),
		},
	];
export type LoaderData = {
	sortRule: string | null;
	tickets: TicketSchema[];
	projectId: number | null;
	tagOptions: string[];
	tagFilters: string[];
};

export const loaderTicketIdx: LoaderFunction =
	async ({ request }) => {
		document.title = "Tickets";
		let tickets = await getTicketAll();
		const url = new URL(request.url);

		const paramProjectId =
			url.searchParams.get("projectId");

		const tagOptions = await getTagsAll();
		const tagFilters = extractFilterTags(url);
		const sortRule =
			url.searchParams.get("sortRule");
		sortItems(sortRule, sortRules, tickets);

		if (!paramProjectId) {
			return {
				tagFilters,
				tagOptions,
				sortRule,
				projectId: null,
				tickets,
			};
		}
		const projectId = Number.parseInt(
			paramProjectId,
		);
		if (!Number.isInteger(projectId)) {
			throw json(
				{},
				{
					status: 400,
					statusText: "Invalid project id.",
				},
			);
		}
		const project = await getProject(projectId);
		if (!project) {
			throw json(
				{},
				{
					status: 400,
					statusText: "Non-existent project.",
				},
			);
		}
		tickets = tickets.filter(
			(ticket) => ticket.projectId === projectId,
		);
		tickets = tickets.filter((ticket) =>
			tagFilters.every((tag) =>
				ticket.tags.includes(tag),
			),
		);
		return {
			tagOptions,
			tagFilters,
			sortRule,
			projectId,
			tickets,
		};
	};
