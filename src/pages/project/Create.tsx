import { FC, useState } from "react";
import {
	Box,
	Button,
	Container,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useNavigate } from "react-router";

import { createProject } from "@database";
import { WithAppBar } from "@views/WithAppBar";
import { StyledEditor } from "@components/StyledEditor";

export const ProjectCreate: FC = () => {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [description, setDescription] =
		useState("");

	const handleSubmit = async () => {
		if (name.trim().length === 0) {
			return;
		}
		const result = await createProject(
			name.normalize().trim(),
			description.normalize().trim(),
		);
		navigate(`/project/${result}`);
	};

	return (
		<WithAppBar location="New project">
			<Container maxWidth="md">
				<Box padding={4}>
					<Stack spacing={2}>
						<TextField
							required
							size="small"
							label="Project name"
							color={
								name.trim().length === 0
									? "error"
									: "primary"
							}
							sx={{
								width: "75%",
							}}
							value={name}
							onChange={(event) =>
								setName(event.target.value)
							}
						/>
						<Typography color="text.secondary">
							Description
						</Typography>
						<StyledEditor
							height="55vh"
							value={description}
							onChange={(value) =>
								setDescription(value || "")
							}
						/>
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
					</Stack>
				</Box>
			</Container>
		</WithAppBar>
	);
};
