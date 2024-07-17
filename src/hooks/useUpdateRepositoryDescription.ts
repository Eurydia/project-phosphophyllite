import { useSnackbar } from "notistack";
import { patchRepositoryDescription } from "~tauri/db/patch";
import { openInDefaultEditor } from "~tauri/temp";
import { AppRepository } from "~types/models";

export const useUpdateRepositoryDescription =
	() => {
		const { closeSnackbar, enqueueSnackbar } =
			useSnackbar();

		const updateDescription = async (
			repository: AppRepository,
		) => {
			const initContent = repository.description;

			const content = await openInDefaultEditor(
				`temp_description_${repository.owner_login}_${repository.name}.md`,
				initContent,
			).catch((err) => {
				enqueueSnackbar(String(err), {
					variant: "error",
					persist: true,
				});
				return undefined;
			});

			if (content === undefined) {
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
					enqueueSnackbar(String(err), {
						variant: "error",
						persist: true,
					}),
			);
			closeSnackbar(id);
		};

		return updateDescription;
	};
