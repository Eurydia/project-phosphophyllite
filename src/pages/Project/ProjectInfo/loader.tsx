import {
	LoaderFunction,
	json,
} from "react-router";

import {
	getProject,
	getTagsAll,
} from "~database";
import { ProjectSchema } from "~types/schemas";

export type LoaderData = {
	project: ProjectSchema;
	tagOptions: string[];
};
export const loaderProjectInfo: LoaderFunction =
	async ({ params }) => {
		if (!params.projectId) {
			throw json(
				{},
				{
					status: 400,
					statusText: "Bad request.",
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
		const tagOptions = await getTagsAll();
		return { project, tagOptions };
	};
