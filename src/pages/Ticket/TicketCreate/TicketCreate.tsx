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

import { createTicket } from "~database";
import { StyledEditor } from "~components/StyledEditor";
import { WithAppBar } from "~views/WithAppBar";

import { Layout } from "./Layout";
import { parseMarkdown } from "~core/markdown";
import { LoaderData } from "~pages/Ticket/TicketCreate/loader";

export const TicketCreate: FC = () => {
	const navigate = useNavigate();
	const { tags, projectId } =
		useLoaderData() as LoaderData;
	const theme = useTheme();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [selectedTags, setSelectTags] = useState<
		string[]
	>([]);

	const handleSubmit = async () => {
		if (title.trim().length === 0) {
			return;
		}
		const ticketId = await createTicket(
			projectId,
			title.normalize().trim(),
			content.normalize().trim(),
			selectedTags,
		);
		navigate(`/ticket/${ticketId}`);
	};

	useEffect(() => {
		const preveiwElement =
			document.getElementById("preview");
		if (!preveiwElement) {
			return;
		}
		preveiwElement.innerHTML =
			parseMarkdown(content);
	}, [content]);

	return (
		<WithAppBar location="New ticket">
			<Layout
				childLeft={
					<Stack
						spacing={2}
						height="100%"
					>
						<Box>
							<Button
								disabled={
									title.trim().length === 0
								}
								variant="contained"
								onClick={handleSubmit}
							>
								Open ticket
							</Button>
						</Box>
						<TextField
							fullWidth
							required
							size="small"
							label="Ticket title"
							color={
								title.trim().length === 0
									? "error"
									: "primary"
							}
							value={title}
							onChange={(event) =>
								setTitle(
									event.target.value.normalize(),
								)
							}
						/>
						<Autocomplete
							freeSolo
							fullWidth
							multiple
							limitTags={3}
							options={tags}
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
						<Typography
							color={theme.palette.text.secondary}
						>
							Description
						</Typography>
						<StyledEditor
							height="100%"
							value={content}
							onChange={(value) =>
								setContent(value || "")
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
