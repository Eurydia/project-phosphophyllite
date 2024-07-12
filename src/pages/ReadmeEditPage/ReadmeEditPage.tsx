import {
	Button,
	Container,
	TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FC, useState } from "react";
import { useLoaderData } from "react-router";
import { useSubmit } from "react-router-dom";
import { CommandPalette } from "~components/CommandPalette";
import { tryDecodeBase64 } from "~core/encoding";
import { putRepositoryReadme } from "~tauri/db/put";
import { ReadmeEditPageLoaderData } from "./loader";

export const ReadmeEditPage: FC = () => {
	const { repository } =
		useLoaderData() as ReadmeEditPageLoaderData;
	const { readme, name, owner_login } =
		repository;
	const { closeSnackbar, enqueueSnackbar } =
		useSnackbar();
	const submit = useSubmit();

	const [content, setContent] = useState(() => {
		if (readme === undefined) {
			return "";
		}
		return tryDecodeBase64(readme) ?? "";
	});
	const handleSubmit = () => {
		const id = enqueueSnackbar(
			"Committing changes...",
			{
				persist: true,
				variant: "info",
			},
		);
		putRepositoryReadme(
			owner_login,
			name,
			content,
		)
			.then(
				() =>
					enqueueSnackbar("Commit success", {
						variant: "success",
					}),
				(err: any) => {
					enqueueSnackbar(
						`Commit failed: ${String(err)}`,
						{ variant: "error" },
					);
				},
			)
			.finally(() => {
				closeSnackbar(id);
				handleReturn();
			});
	};
	const handleReturn = () => {
		submit(
			{},
			{
				action: `/${owner_login}/${name}`,
				replace: true,
			},
		);
	};

	const handleContentChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		setContent(e.target.value);
	};

	return (
		<Container maxWidth="md">
			<CommandPalette localCommands={[]} />
			<TextField
				multiline
				fullWidth
				value={content}
				onChange={handleContentChange}
			/>
			<Button
				variant="contained"
				disableElevation
				onClick={handleSubmit}
			>
				Submit
			</Button>
			<Button
				variant="outlined"
				disableElevation
				onClick={handleReturn}
			>
				Cancel
			</Button>
		</Container>
	);
};
