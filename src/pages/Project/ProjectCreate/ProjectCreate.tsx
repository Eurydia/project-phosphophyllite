import { CreateNewFolderRounded } from "@mui/icons-material";
import {
	Button,
	Grid,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import { useSubmit } from "react-router-dom";
import { StyledEditor } from "~components/StyledEditor";
import { StyledAutocomplete } from "~components/TagAutocomplete";
import { parseMarkdown } from "~core/markdown";
import { createProject } from "~database";
import { WithAppBar } from "~views/WithAppBar";
import { Layout } from "./Layout";

export const ProjectCreate: FC = () => {
	const tagOptions = useLoaderData() as string[];
	const theme = useTheme();
	const submit = useSubmit();

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
			name,
			description,
			selectedTags,
		);
		submit(
			{},
			{
				action: `/project/${projectId}`,
				method: "get",
			},
		);
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
							<StyledAutocomplete
								fullWidth
								options={tagOptions}
								value={selectedTags}
								onChange={setSelectTags}
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
