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
	getTicket,
	updateTicket,
} from "~database/index";
import { WithAppBar } from "~views/WithAppBar";
import { Layout } from "./Layout";
import { LoaderData } from "./loader";

export const TicketInfo: FC = () => {
	const { ticket: loadedTicket, tagOptions } =
		useLoaderData() as LoaderData;
	const theme = useTheme();
	const submit = useSubmit();

	const [isEditMode, setIsEditMode] =
		useState(false);
	const [ticket, setTicket] =
		useState(loadedTicket);
	const [title, setTitle] = useState(
		ticket.title,
	);
	const [content, setContent] = useState(
		ticket.content,
	);
	const [selectedTags, setSelectedTags] =
		useState(ticket.tags);

	useHotkeys("ctrl+alt+e", () =>
		setIsEditMode(!isEditMode),
	);

	useEffect(() => {
		(async () => {
			if (!ticket) {
				return;
			}
			if (!isEditMode) {
				return;
			}
			const ticketId = await updateTicket(
				ticket.projectId!,
				title,
				content,
				selectedTags,
			);
			const updatedTicket = await getTicket(
				ticketId,
			);
			if (!updatedTicket) {
				return;
			}
			setTicket(updatedTicket);
		})();
	}, [content, selectedTags, title, isEditMode]);

	useEffect(() => {
		const preveiwElement =
			document.getElementById("preview");
		if (!preveiwElement) {
			return;
		}
		preveiwElement.innerHTML =
			parseMarkdown(content);
	}, [content]);

	const redirectToProject = () => {
		submit(
			{},
			{
				action: `/project/${ticket.projectId}`,
				method: "get",
			},
		);
	};

	if (!ticket) {
		return;
	}

	return (
		<WithAppBar
			location={ticket.title}
			seconadaryNav={
				<Button
					disableElevation
					variant="contained"
					onClick={redirectToProject}
				>
					Project home
				</Button>
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
							<StyledEditor
								value={content}
								onChange={(value) =>
									setContent(value || "")
								}
							/>
						</Grid>
					</Grid>
				}
				slotPreview={
					<Container maxWidth="md">
						{!isEditMode && (
							<Fragment>
								<Typography variant="subtitle2">
									Created:{" "}
									{ticket.dateCreated.toUTCString()}
								</Typography>
								<Typography variant="subtitle2">
									Last modified:{" "}
									{ticket.lastModified.toUTCString()}
								</Typography>
								<Typography variant="subtitle2">
									Tags:{" "}
									{ticket.tags.length > 0
										? ticket.tags.join(", ")
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
