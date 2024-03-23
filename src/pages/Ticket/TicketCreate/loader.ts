import {
	LoaderFunction,
	json,
} from "react-router";

import {
	getProject,
	getTicketAll,
} from "~database";

export type LoaderData = {
	projectId: number;
	tags: string[];
};

export const loaderTicketCreate: LoaderFunction =
	async ({ request }) => {
		const url = new URL(request.url);
		const searchParams = url.searchParams;
		const paramProjectId =
			searchParams.get("projectId");
		if (!paramProjectId) {
			throw json(
				{},
				{
					status: 400,
					statusText: "Bad request.",
				},
			);
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

		document.title = "New ticket";

		const tickets = await getTicketAll();
		const uniqueTags: Set<string> = new Set();
		for (const ticket of tickets) {
			for (const tag of ticket.tags) {
				uniqueTags.add(tag);
			}
		}
		const tags: string[] = [...uniqueTags];
		tags.sort();

		return { tags, projectId };
	};
