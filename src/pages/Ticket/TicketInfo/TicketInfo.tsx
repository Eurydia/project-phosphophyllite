import {
	FC,
	Fragment,
	useEffect,
	useState,
} from "react";
import { useLoaderData } from "react-router";
import {
	Container,
	IconButton,
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
	getTicket,
	updateTicket,
} from "~database";
import { StyledEditor } from "~components/StyledEditor";
import { parseMarkdown } from "~core/markdown";
import { Layout } from "~pages/Project/ProjectInfo/Layout";
import { LoaderData } from "~pages/Ticket/TicketInfo/loader";

export const TicketInfo: FC = () => {
	const loadedTicket =
		useLoaderData() as LoaderData;
	const theme = useTheme();

	const [isEditMode, setIsEditMode] =
		useState(false);
	const [ticket, setTicket] =
		useState(loadedTicket);

	const [content, setContent] = useState(
		!ticket ? "" : ticket.content,
	);
	useHotkeys("ctrl + alt + e", () =>
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
				ticket.ticketId!,
				ticket.title,
				content,
				ticket.tags,
			);
			setTicket(await getTicket(ticketId));
		})();
	}, [content]);
	useEffect(() => {
		const preveiwElement =
			document.getElementById("preview");
		if (!preveiwElement) {
			return;
		}
		preveiwElement.innerHTML =
			parseMarkdown(content);
	}, [content]);

	if (!ticket) {
		return;
	}
	return (
		<WithAppBar location={ticket.title}>
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
						value={content}
						onChange={(value) =>
							setContent(value || "")
						}
					/>
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
