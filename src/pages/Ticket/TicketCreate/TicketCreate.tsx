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
import { createTicket } from "~database";
import { LoaderData } from "~pages/Ticket/TicketCreate/loader";
import { WithAppBar } from "~views/WithAppBar";
import { Layout } from "./Layout";

export const TicketCreate: FC = () => {
	const { tagOptions, projectId } =
		useLoaderData() as LoaderData;
	const theme = useTheme();
	const submit = useSubmit();

	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	const [selectedTags, setSelectedTags] =
		useState<string[]>([]);

	const handleSubmit = async () => {
		if (title.trim().length === 0) {
			return;
		}
		const ticketId = await createTicket(
			projectId,
			title,
			content,
			selectedTags,
		);
		submit(
			{},
			{
				action: `/ticket/${ticketId}`,
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
			parseMarkdown(content);
	}, [content]);

	return (
		<WithAppBar
			location="New ticket"
			seconadaryNav={
				<Button
					disabled={title.trim().length === 0}
					variant="contained"
					onClick={handleSubmit}
				>
					Open ticket
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
							<Typography
								color={
									theme.palette.text.secondary
								}
							>
								Content
							</Typography>
						</Grid>
						<Grid
							item
							md={12}
						>
							<StyledEditor
								value={content}
								onChange={(value) =>
									setContent(value || "")
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
