import {
	FC,
	Fragment,
	useEffect,
	useState,
} from "react";
import {
	LoaderFunction,
	json,
	useLoaderData,
} from "react-router";
import {
	Box,
	Button,
	Container,
	Stack,
	Typography,
} from "@mui/material";
import { Circle } from "@mui/icons-material";

import { WithAppBar } from "~views/WithAppBar";
import {
	getProject,
	updateProject,
} from "~database";
import { ProjectSchema } from "~types/schemas";
import { StyledEditor } from "~components/StyledEditor";

export const projectInfoLoader: LoaderFunction =
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

export const ProjectInfo: FC = () => {
	const loaderProject = useLoaderData() as
		| ProjectSchema
		| undefined;
	const [project, setProject] = useState(
		loaderProject,
	);
	const [description, setDescription] = useState(
		!project ? "" : project.description,
	);

	useEffect(() => {
		(async () => {
			if (!project) {
				return;
			}
			const projectId = await updateProject(
				project.projectId!,
				project.name,
				description,
				project.tags,
			);
			setProject(await getProject(projectId));
		})();
	}, [description]);

	if (!project) {
		return;
	}

	return (
		<WithAppBar
			location={project.name}
			seconadaryNav={
				project.tags.length > 0
					? `Tags: ${project.tags.join(", ")}`
					: ""
			}
		>
			<Container maxWidth="md">
				<StyledEditor
					height="500px"
					value={description}
					onChange={(value) =>
						setDescription(value || "")
					}
				/>
			</Container>
		</WithAppBar>
	);
};
