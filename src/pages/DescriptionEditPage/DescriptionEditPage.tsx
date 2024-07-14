import ReactCodeMirror, {
	EditorView,
} from "@uiw/react-codemirror";
import { useSnackbar } from "notistack";
import { FC, Fragment, useState } from "react";
import { useLoaderData } from "react-router";
import { useSubmit } from "react-router-dom";
import { CommandPalette } from "~components/CommandPalette";
import { useEditorTheme } from "~hooks/useEditorTheme";
import { useSystemCommands } from "~hooks/useSystemCommands";
import { patchRepositoryDescription } from "~tauri/db/patch";
import { DescriptionEditPageLoaderData } from "./loader";

export const DescriptionEditPage: FC = () => {
	const { repository } =
		useLoaderData() as DescriptionEditPageLoaderData;
	const { description, name, owner_login } =
		repository;
	const { closeSnackbar, enqueueSnackbar } =
		useSnackbar();
	const submit = useSubmit();
	const editorTheme = useEditorTheme();

	const [content, setContent] =
		useState(description);

	const systemCommands = useSystemCommands();
	const handleSubmit = async () => {
		const id = enqueueSnackbar(
			"Committing changes...",
			{
				persist: true,
				variant: "info",
			},
		);
		await patchRepositoryDescription(
			owner_login,
			name,
			content,
		).then(
			() =>
				enqueueSnackbar("Commit success", {
					variant: "success",
				}),
			(err: any) =>
				enqueueSnackbar(
					`Commit failed: ${String(err)}`,
					{ variant: "error" },
				),
		);
		closeSnackbar(id);
		handleReturn();
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
	const commands = [
		...systemCommands,
		{
			label: "Commit changes",
			action: handleSubmit,
		},
		{
			label: "Cancel",
			action: handleReturn,
		},
	];

	return (
		<Fragment>
			<ReactCodeMirror
				height="90vh"
				theme={editorTheme}
				value={content}
				lang="markdown"
				onChange={setContent}
				extensions={[EditorView.lineWrapping]}
			/>
			<CommandPalette commands={commands} />
		</Fragment>
	);
};
