import {
	Button,
	Container,
	Dialog,
	DialogActions,
	DialogContent,
	Divider,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FC, Fragment, useState } from "react";
import { useLoaderData } from "react-router";
import { CommandPalette } from "~components/CommandPalette";
import { TerminalStyleList } from "~components/TerminalStyleList";
import { tryDecodeBase64 } from "~core/encoding";
import { normalizeDateString } from "~core/time";
import { useRepositoryCommands } from "~hooks/useRepositoryCommands";
import { putRepositoryReadme } from "~tauri/db/put";
import { CommandOption } from "~types/generic";
import { RepositoryPageLoaderData } from "./loader";

export const RepositoryPage: FC = () => {
	const { repository, issues } =
		useLoaderData() as RepositoryPageLoaderData;
	const [isEditingReadme, setIsEditingReadme] =
		useState(false);
	const { enqueueSnackbar, closeSnackbar } =
		useSnackbar();
	const {
		archived,
		created_at,
		description,
		private: private_,
		pushed_at,
		updated_at,
		readme,
	} = repository;

	const repositoryCommands =
		useRepositoryCommands(repository, issues);

	const localCommands: CommandOption[] = [
		{
			label: "Edit readme",
			action: () => setIsEditingReadme(true),
		},
	];

	const decodedReadme =
		readme !== undefined
			? tryDecodeBase64(readme) ?? ""
			: "";

	const [readmeContent, setReadmeContent] =
		useState(decodedReadme);

	const listItems: {
		label: string;
		value: string;
	}[] = [
		{
			label: "Description",
			value: description,
		},
		{
			label: "Private",
			value: private_ ? "Yes" : "No",
		},
		{
			label: "Archived",
			value: archived ? "Yes" : "No",
		},
		{
			label: "Created",
			value: normalizeDateString(created_at),
		},
		{
			label: "Last updated",
			value: normalizeDateString(updated_at),
		},
		{
			label: "Last pushed",
			value: normalizeDateString(pushed_at),
		},
	];

	return (
		<Container maxWidth="sm">
			<CommandPalette
				localCommands={[
					...repositoryCommands,
					...localCommands,
				]}
			/>
			<Stack
				spacing={2}
				divider={<Divider />}
			>
				<TerminalStyleList items={listItems} />
				<Typography whiteSpace="pre-wrap">
					{decodedReadme}
				</Typography>
				<Fragment>
					{issues.map(
						({ number, title, state }) => (
							<Fragment
								key={`#${number} ${title}`}
							>
								<Typography>
									#{number} ({state}) {title}
								</Typography>
							</Fragment>
						),
					)}
				</Fragment>
			</Stack>
			<Dialog
				maxWidth="md"
				fullWidth
				open={isEditingReadme}
				scroll="body"
				onAbort={() => setIsEditingReadme(false)}
				PaperProps={{
					elevation: 0,
				}}
			>
				<DialogContent>
					<TextField
						name="content"
						multiline
						fullWidth
						value={readmeContent}
						onChange={(e) =>
							setReadmeContent(e.target.value)
						}
					/>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						disableElevation
						onClick={() => {
							setIsEditingReadme(false);
							const id = enqueueSnackbar(
								"Committing changes...",
								{
									persist: true,
									variant: "info",
								},
							);
							putRepositoryReadme(
								repository.owner_login,
								repository.name,
								readmeContent,
							)
								.then(
									() =>
										enqueueSnackbar(
											"Commit successful",
											{
												variant: "success",
											},
										),
									(error: any) =>
										enqueueSnackbar(
											`An error occurred: ${String(
												error,
											)}`,
											{
												variant: "error",
											},
										),
								)
								.finally(() => {
									closeSnackbar(id);
									window.location.reload();
								});
						}}
					>
						Commit
					</Button>
					<Button
						variant="outlined"
						disableElevation
						onClick={() =>
							setIsEditingReadme(false)
						}
					>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};
