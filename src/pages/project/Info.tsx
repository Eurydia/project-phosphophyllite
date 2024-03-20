import {
	Box,
	Container,
	Typography,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useParams } from "react-router";
import {
	ProjectSchema,
	getProject,
} from "../../database";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { WithAppBar } from "@views/WithAppBar";

export const ProjectInfo: FC = () => {
	const { projectId } = useParams();
	const [project, setProject] = useState<
		ProjectSchema | undefined
	>(undefined);

	useEffect(() => {
		if (!projectId) {
			return;
		}
		const _projectId = Number.parseInt(projectId);
		if (!Number.isInteger(_projectId)) {
			return;
		}
		(async () => {
			setProject(await getProject(_projectId));
		})();
	}, [projectId]);

	useEffect(() => {
		if (!project) {
			return;
		}
		const targetNode =
			document.getElementById("main");
		if (!targetNode) {
			return;
		}
		const r = unified()
			.use(remarkParse)
			.use(remarkRehype)
			.use(rehypeSanitize)
			.use(rehypeStringify)
			.processSync(project.description);
		targetNode.innerHTML = String(r);
	}, [project]);

	if (!project) {
		return;
	}

	return (
		<WithAppBar location={project.name}>
			<Container maxWidth="md">
				<Box padding={2}>
					<main id="main"></main>
				</Box>
			</Container>
		</WithAppBar>
	);
};
