import {
	LoaderFunction,
	json,
} from "react-router";
import {
	getProject,
	getTagsAll,
} from "~database";

export type LoaderData = {
	projectId: number;
	tagOptions: string[];
};

export const loaderTicketCreate: LoaderFunction =
	async ({ request }) => {
		const url = new URL(request.url);
		const paramProjectId =
			url.searchParams.get("projectId");

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
		const tagOptions = await getTagsAll();
		return { tagOptions, projectId };
	};
