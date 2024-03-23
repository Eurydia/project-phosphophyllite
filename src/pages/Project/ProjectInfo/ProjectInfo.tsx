import {
	FC,
	Fragment,
	useEffect,
	useState,
} from "react";
import { useLoaderData } from "react-router";
import { createSearchParams } from "react-router-dom";
import {
	Container,
	Divider,
	IconButton,
	Link,
	Stack,
	Typography,
	useTheme,
} from "@mui/material";
import {
	CodeRounded,
	MenuBookRounded,
} from "@mui/icons-material";

import { useHotkeys } from "react-hotkeys-hook";

import { WithAppBar } from "~views/WithAppBar";
import {
	getProject,
	updateProject,
} from "~database";
import { ProjectSchema } from "~types/schemas";
import { StyledEditor } from "~components/StyledEditor";

import { parseMarkdown } from "~core/markdown";
import { Layout } from "~pages/Project/ProjectInfo/Layout";

export const ProjectInfo: FC = () => {
	const loadedProject = useLoaderData() as
		| ProjectSchema
		| undefined;
	const theme = useTheme();

	const [isEditMode, setIsEditMode] =
		useState(false);
	const [project, setProject] = useState(
		loadedProject,
	);

	const [description, setDescription] = useState(
		!project ? "" : project.description,
	);
	useHotkeys("ctrl + alt + e", () =>
		setIsEditMode(!isEditMode),
	);

	useEffect(() => {
		(async () => {
			if (!project) {
				return;
			}
			if (!isEditMode) {
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
	useEffect(() => {
		const preveiwElement =
			document.getElementById("preview");
		if (!preveiwElement) {
			return;
		}
		preveiwElement.innerHTML =
			parseMarkdown(description);
	}, [description]);

	if (!project) {
		return;
	}
	return (
		<WithAppBar
			location={project.name}
			seconadaryNav={
				<Stack
					spacing={1}
					direction="row"
					divider={
						<Divider
							flexItem
							orientation="vertical"
							variant="fullWidth"
						/>
					}
				>
					<Link
						href={`/ticket/?${createSearchParams({
							projectId:
								project.projectId!.toString(),
						})}`}
					>
						Tickets
					</Link>
				</Stack>
			}
		>
			<IconButton
				size="large"
				title={isEditMode ? "Read" : "Edit"}
				sx={{
					position: "absolute",
					right: theme.spacing(4),
					bottom: theme.spacing(4),
				}}
				onClick={() => {
					setIsEditMode(!isEditMode);
					return;
				}}
			>
				{isEditMode ? (
					<MenuBookRounded />
				) : (
					<CodeRounded />
				)}
			</IconButton>
			<Layout
				isEditMode={isEditMode}
				slotEditor={
					<StyledEditor
						height="100%"
						value={description}
						onChange={(value) =>
							setDescription(value || "")
						}
					/>
				}
				slotPreview={
					<Container maxWidth="md">
						{!isEditMode && (
							<Fragment>
								<Typography variant="subtitle2">
									Created:{" "}
									{project.dateCreated.toUTCString()}
								</Typography>
								<Typography variant="subtitle2">
									Last modified:{" "}
									{project.lastModified.toUTCString()}
								</Typography>
								<Typography variant="subtitle2">
									Tags:{" "}
									{project.tags.length > 0
										? project.tags.join(", ")
										: "-"}
								</Typography>
							</Fragment>
						)}
						<Typography
							id="preview"
							maxWidth="100%"
							height="100%"
							overflow="auto"
							component="main"
							display="block"
							sx={{
								wordBreak: "break-word",
								wordWrap: "break-word",
								scrollbarWidth: "thin",
							}}
						/>
					</Container>
				}
			/>
		</WithAppBar>
	);
};
