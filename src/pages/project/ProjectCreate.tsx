import { FC, useState } from "react";
import {
	Autocomplete,
	Box,
	Button,
	Container,
	Grid,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import {
	LoaderFunction,
	useLoaderData,
	useNavigate,
} from "react-router";

import {
	createProject,
	getProjectAll,
} from "~database";
import { WithAppBar } from "~views/WithAppBar";
import { StyledEditor } from "~components/StyledEditor";

export const projectCreateLoader: LoaderFunction =
	async () => {
		document.title = "New project";

		const projects = await getProjectAll();
		const uniqueTags: Set<string> = new Set();
		for (const project of projects) {
			for (const tag of project.tags) {
				uniqueTags.add(tag);
			}
		}
		const tags: string[] = [...uniqueTags];
		tags.sort();
		return tags;
	};

export const ProjectCreate: FC = () => {
	const navigate = useNavigate();
	const tagOptions = useLoaderData() as string[];

	const [name, setName] = useState("");
	const [description, setDescription] =
		useState("");
	const [selectedTags, setSelectTags] = useState<
		string[]
	>([]);

	const handleSubmit = async () => {
		if (name.trim().length === 0) {
			return;
		}
		const projectId = await createProject(
			name.normalize().trim(),
			description.normalize().trim(),
			selectedTags,
		);
		navigate(`/project/${projectId}`);
	};

	return (
		<WithAppBar location="New project">
			<Grid
				container
				padding={4}
			>
				<Grid
					item
					md={6}
				>
					<Stack spacing={2}>
						<Box>
							<Button
								disabled={
									name.trim().length === 0
								}
								variant="contained"
								onClick={handleSubmit}
							>
								Create project
							</Button>
						</Box>
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
						<Autocomplete
							freeSolo
							fullWidth
							multiple
							options={tagOptions}
							value={selectedTags}
							onChange={(_, values) => {
								setSelectTags(
									values.map((value) =>
										value.normalize(),
									),
								);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Tags"
									size="small"
								/>
							)}
						/>
						<Typography color="text.secondary">
							Description
						</Typography>
						<StyledEditor
							height="45vh"
							value={description}
							onChange={(value) =>
								setDescription(value || "")
							}
						/>
					</Stack>
				</Grid>
				<Grid
					item
					md={6}
				>
					<main id="preview"></main>
				</Grid>
			</Grid>
		</WithAppBar>
	);
};
