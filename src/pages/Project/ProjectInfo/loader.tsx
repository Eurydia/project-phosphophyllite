import {
	LoaderFunction,
	json,
} from "react-router";

import { getProject } from "~database";

export const loaderProjectInfo: LoaderFunction =
	async ({ params }) => {
		if (!params.projectId) {
			throw json(
				{},
				{
					status: 404,
					statusText: "Invalid project ID.",
				},
			);
		}

		const projectId = Number.parseInt(
			params.projectId,
		);
		if (!Number.isFinite(projectId)) {
			throw json(
				{},
				{
					status: 404,
					statusText: "Invalid project ID.",
				},
			);
		}
		const project = await getProject(projectId);
		if (!project) {
			throw json(
				{},
				{
					status: 404,
					statusText: "Project not found.",
				},
			);
		}

		document.title = project.name;
		return project;
	};
