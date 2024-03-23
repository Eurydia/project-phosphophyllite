import {
	LoaderFunction,
	json,
} from "react-router-dom";
import {
	getProject,
	getTicketAll,
} from "~database";
import { TicketSchema } from "~types/schemas";

export const sortRules = [
	{ value: "title", label: "title" },
	{
		value: "lastModified",
		label: "Last modified",
	},
];
const sortByString = (a: string, b: string) => {
	return a.localeCompare(b);
};

const sortByNumber = (a: number, b: number) => {
	return a - b;
};

export type LoaderData = {
	sortRule: string | null;
	tickets: TicketSchema[];
	projectId: number | null;
};

export const loaderTicketIdx: LoaderFunction =
	async ({ request }) => {
		document.title = "Tickets";
		const tickets = await getTicketAll();

		const url = new URL(request.url);

		const sortRule =
			url.searchParams.get("sortBy");
		switch (sortRule) {
			case "title":
				tickets.sort((a, b) =>
					sortByString(a.title, b.title),
				);
				break;
			case null:
			case "lastModified":
			default:
				tickets.sort((a, b) =>
					sortByNumber(
						b.lastModified.getTime(),
						a.lastModified.getTime(),
					),
				);
				break;
		}

		const paramProjectId =
			url.searchParams.get("projectId");
		if (!paramProjectId) {
			return {
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

		return {
			sortRule,
			projectId,
			tickets: tickets.filter(
				(ticket) =>
					ticket.projectId === projectId,
			),
		};
	};
