import { CreateNewFolderRounded } from "@mui/icons-material";
import {
	Autocomplete,
	Button,
	Grid,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import {
	redirect,
	useLoaderData,
} from "react-router";
import { StyledEditor } from "~components/StyledEditor";
import { parseMarkdown } from "~core/markdown";
import { createProject } from "~database";
import { WithAppBar } from "~views/WithAppBar";
import { Layout } from "./Layout";

export const ProjectCreate: FC = () => {
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
		redirect(`/project/${projectId}`);
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
		<WithAppBar
			location="New project"
			seconadaryNav={
				<Button
					disableElevation
					disabled={name.trim().length === 0}
					variant="contained"
					onClick={handleSubmit}
					startIcon={<CreateNewFolderRounded />}
				>
					Create project
				</Button>
			}
		>
			<Layout
				childLeft={
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
						</Grid>
						<Grid
							item
							md={12}
						>
							<Typography
								color={
									theme.palette.text.secondary
								}
							>
								Description
							</Typography>
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
