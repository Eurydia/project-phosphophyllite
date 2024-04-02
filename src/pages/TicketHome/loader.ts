// import {
// 	LoaderFunction,
// 	json,
// } from "react-router-dom";
// import {
// 	extractFilterTags,
// 	sortItems,
// } from "~core/query";
// import {
// 	getProject,
// 	getProjectAll,
// 	getTagsAll,
// 	getTicketAll,
// } from "~database";
// import { SortRule } from "~types/generics";
// import {
// 	ProjectSchema,
// 	TicketSchema,
// } from "~types/schemas";

// export const sortRules: SortRule<TicketSchema>[] =
// 	[
// 		{
// 			value: "lastModified",
// 			label: "Last modified (0-9)",
// 			compareFn: (a, b) =>
// 				b.lastModified.getTime() -
// 				a.lastModified.getTime(),
// 		},
// 		{
// 			value: "title",
// 			label: "Title (A-Z)",
// 			compareFn: (a, b) =>
// 				a.title.localeCompare(b.title),
// 		},
// 	];
// export type LoaderData = {
// 	sortRule: string | null;
// 	project: ProjectSchema | null;
// 	tickets: TicketSchema[];
// 	projectOptions: ProjectSchema[];
// 	tagOptions: string[];
// 	tagFilters: string[];
// };

// export const loaderTicketHome: LoaderFunction =
// 	async ({ request }) => {
// 		document.title = "Tickets";
// 		let tickets = await getTicketAll();
// 		const url = new URL(request.url);

// 		const paramProjectId =
// 			url.searchParams.get("projectId");
// 		const paramTags =
// 			url.searchParams.get("tags");
// 		const paramSortRule =
// 			url.searchParams.get("sortRule");

// 		const projectOptions = await getProjectAll();
// 		const tagOptions = await getTagsAll();
// 		const tagFilters =
// 			extractFilterTags(paramTags);
// 		sortItems(paramSortRule, sortRules, tickets);

// 		if (!paramProjectId) {
// 			return {
// 				projectOptions,
// 				tagFilters,
// 				tagOptions,
// 				sortRule: paramSortRule,
// 				project: null,
// 				tickets,
// 			};
// 		}
// 		const projectId = Number.parseInt(
// 			paramProjectId,
// 		);
// 		if (!Number.isInteger(projectId)) {
// 			throw json(
// 				{},
// 				{
// 					status: 400,
// 					statusText: "Invalid project id.",
// 				},
// 			);
// 		}
// 		const project = await getProject(projectId);
// 		if (!project) {
// 			throw json(
// 				{},
// 				{
// 					status: 400,
// 					statusText: "Non-existent project.",
// 				},
// 			);
// 		}
// 		tickets = tickets.filter(
// 			(ticket) => ticket.projectId === projectId,
// 		);
// 		tickets = tickets.filter((ticket) =>
// 			tagFilters.every((tag) =>
// 				ticket.tags.includes(tag),
// 			),
// 		);
// 		return {
// 			projectOptions,
// 			tagOptions,
// 			tagFilters,
// 			sortRule: paramSortRule,
// 			project,
// 			tickets,
// 		};
// 	};
