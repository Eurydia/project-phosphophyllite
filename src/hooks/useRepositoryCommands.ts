import { useSnackbar } from "notistack";
import { useMemo } from "react";
import { useSubmit } from "react-router-dom";
import { patchRepositoryDescription } from "~tauri/db/patch";
import { openLink } from "~tauri/path";
import { openInDefaultEditor } from "~tauri/temp";
import { CommandOption } from "~types/generic";
import {
	AppIssue,
	AppRepository,
} from "~types/models";

export const useRepositoryCommands = (
	repository: AppRepository,
	issues: AppIssue[],
) => {
	const { closeSnackbar, enqueueSnackbar } =
		useSnackbar();
	const submit = useSubmit();

	const commands = useMemo(() => {
		const _commands: CommandOption[] = [
			{
				label: "Reveal repository on GitHub",
				system: true,
				action: () =>
					openLink(repository.html_url),
			},
			{
				label: "Edit repository description",
				system: true,
				action: async () => {
					const initContent =
						repository.description;

					const content =
						await openInDefaultEditor(
							`temp_description_${repository.owner_login}_${repository.name}.md`,
							initContent,
						).catch((err) => {
							enqueueSnackbar(
								`Something went wrong: ${String(
									err,
								)}`,
								{
									variant: "error",
								},
							);
							return null;
						});

					if (content === null) {
						return;
					}
					if (content === initContent) {
						enqueueSnackbar(
							"Content unchanged. Skipping update.",
							{
								variant: "info",
							},
						);
						return;
					}

					const id = enqueueSnackbar(
						"Updating repository description...",
						{
							variant: "info",
							persist: true,
						},
					);
					await patchRepositoryDescription(
						repository.owner_login,
						repository.name,
						content,
					).then(
						() =>
							enqueueSnackbar("Update complete", {
								variant: "success",
							}),
						(err) =>
							enqueueSnackbar(
								`Something went wrong: ${String(
									err,
								)}`,
								{
									variant: "error",
								},
							),
					);
					closeSnackbar(id);
				},
			},
		];
		for (const issue of issues) {
			_commands.push({
				label: `Issue #${issue.number} ${issue.title}`,
				description: `~/${repository.full_name}/issue/${issue.number}`,
				action: () =>
					submit(
						{},
						{
							action: `/${repository.full_name}/${issue.number}`,
						},
					),
			});
		}
		return _commands;
	}, [repository.url]);
	return commands;
};
