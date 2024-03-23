import {
	CodeRounded,
	MenuBookRounded,
} from "@mui/icons-material";
import {
	Button,
	Container,
	Grid,
	IconButton,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import {
	FC,
	Fragment,
	useEffect,
	useState,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useLoaderData } from "react-router";
import { useSubmit } from "react-router-dom";
import { StyledEditor } from "~components/StyledEditor";
import { StyledAutocomplete } from "~components/TagAutocomplete";
import { parseMarkdown } from "~core/markdown";
import {
	getProject,
	updateProject,
} from "~database";
import { WithAppBar } from "~views/WithAppBar";
import { Layout } from "./Layout";
import { LoaderData } from "./loader";

export const ProjectInfo: FC = () => {
	const {
		project: loadedProject,
		tagOptions: tagOptions,
	} = useLoaderData() as LoaderData;

	const theme = useTheme();
	const submit = useSubmit();

	const [isEditMode, setIsEditMode] =
		useState(false);

	const [project, setProject] = useState(
		loadedProject,
	);

	const [name, setName] = useState(project.name);
	const [description, setDescription] = useState(
		project.description,
	);
	const [selectedTags, setSelectedTags] =
		useState(project.tags);

	useHotkeys("ctrl+alt+e", () =>
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
				name,
				description,
				selectedTags,
			);
			const updatedProject = await getProject(
				projectId,
			);
			if (!updatedProject) {
				return;
			}
			setProject(updatedProject);
		})();
	}, [
		description,
		selectedTags,
		name,
		isEditMode,
	]);

	useEffect(() => {
		const preveiwElement =
			document.getElementById("preview");
		if (!preveiwElement) {
			return;
		}
		preveiwElement.innerHTML =
			parseMarkdown(description);
	}, [description]);

	const redirectToTicket = () => {
		if (!project || !project.projectId) {
			return;
		}
		submit(
			{ projectId: project.projectId },
			{
				action: "/ticket",
				method: "get",
			},
		);
	};

	if (!project) {
		return;
	}

	return (
		<WithAppBar
			location={project.name}
			seconadaryNav={
				<Button
					disableElevation
					variant="contained"
					onClick={redirectToTicket}
				>
					tickets view
				</Button>
			}
		>
			<IconButton
				color="primary"
				title={isEditMode ? "Read" : "Edit"}
				sx={{
					position: "fixed",
					right: theme.spacing(2),
					bottom: theme.spacing(2),
				}}
				onClick={() => setIsEditMode(!isEditMode)}
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
					<Grid
						container
						spacing={1}
						height="100%"
					>
						<Grid
							item
							md={12}
						>
							<TextField
								fullWidth
								required
								size="small"
								label="Project name"
								color={
									name.trim().length === 0
										? "error"
										: "primary"
								}
								value={name}
								onChange={(event) =>
									setName(
										event.target.value.normalize(),
									)
								}
							/>
						</Grid>
						<Grid
							item
							md={12}
						>
							<StyledAutocomplete
								fullWidth
								options={tagOptions}
								value={selectedTags}
								onChange={setSelectedTags}
							/>
						</Grid>
						<Grid
							item
							md={12}
						>
							<StyledEditor
								value={description}
								onChange={(value) =>
									setDescription(value || "")
								}
							/>
						</Grid>
					</Grid>
				}
				slotPreview={
					<Container maxWidth="sm">
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
