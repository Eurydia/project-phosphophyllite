import { useSnackbar } from "notistack";
import { putRepositoryReadme } from "~tauri/db/put";
import { openInDefaultEditor } from "~tauri/temp";
import { AppRepository } from "~types/models";

export const useUpdateRespositoryReadme = () => {
	const { closeSnackbar, enqueueSnackbar } =
		useSnackbar();

	const updateReadme = async (
		repository: AppRepository,
	) => {
		const initContent = window.atob(
			repository.readme,
		);
		const content = await openInDefaultEditor(
			`temp_readme_${repository.owner_login}_${repository.name}.md`,
			initContent,
		).catch((err) => {
			enqueueSnackbar(String(err), {
				variant: "error",
				persist: true,
			});
			return null;
		});

		if (content === null) {
			return;
		}

		const id = enqueueSnackbar(
			"Updating repository README...",
			{
				variant: "info",
				persist: true,
			},
		);
		await putRepositoryReadme(
			repository.owner_login,
			repository.name,
			content,
		).then(
			() =>
				enqueueSnackbar("Update complete", {
					variant: "success",
				}),
			(err) =>
				enqueueSnackbar(String(err), {
					variant: "error",
					persist: true,
				}),
		);
		closeSnackbar(id);
	};

	return updateReadme;
};
