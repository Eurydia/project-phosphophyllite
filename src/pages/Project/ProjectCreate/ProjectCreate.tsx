import { FC, useEffect, useState } from "react";
import {
	useLoaderData,
	useNavigate,
} from "react-router";

import {
	Autocomplete,
	Box,
	Button,
	Stack,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";

import { CreateNewFolderRounded } from "@mui/icons-material";
import { StyledEditor } from "~components/StyledEditor";
import { parseMarkdown } from "~core/markdown";
import { createProject } from "~database";
import { Layout } from "~pages/Project/ProjectCreate/Layout";
import { WithAppBar } from "~views/WithAppBar";

export const ProjectCreate: FC = () => {
	const navigate = useNavigate();
	const tagOptions = useLoaderData() as string[];
	const theme = useTheme();

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

	useEffect(() => {
		const preveiwElement =
			document.getElementById("preview");
		if (!preveiwElement) {
			return;
		}
		preveiwElement.innerHTML =
			parseMarkdown(description);
	}, [description]);

	return (
		<WithAppBar location="New project">
			<Layout
				childLeft={
					<Stack
						spacing={2}
						height="100%"
					>
						<Box>
							<Button
								disabled={
									name.trim().length === 0
								}
								variant="contained"
								onClick={handleSubmit}
								startIcon={
									<CreateNewFolderRounded />
								}
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
							limitTags={3}
							options={tagOptions}
							value={selectedTags}
							onChange={(_, values) => {
								setSelectTags(values);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									label="Tags"
									size="small"
								/>
							)}
						/>
						<Typography
							color={theme.palette.text.secondary}
						>
							Description
						</Typography>
						<StyledEditor
							height="100%"
							value={description}
							onChange={(value) =>
								setDescription(value || "")
							}
						/>
					</Stack>
				}
				childRight={
					<Typography
						id="preview"
						maxWidth="100%"
						height="100%"
						overflow="auto"
						variant="body1"
						component="main"
						display="block"
					/>
				}
			/>
		</WithAppBar>
	);
};
