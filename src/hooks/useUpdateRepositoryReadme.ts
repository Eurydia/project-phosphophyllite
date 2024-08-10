import { toast } from "react-toastify";
import { putRepositoryReadme } from "~tauri/github/put";
import { openInEditor } from "~tauri/open";
import { AppRepository } from "~types/models";

export const useUpdateRespositoryReadme = () => {
	const updateReadme = async (
		repository: AppRepository,
	) => {
		const initContent = window.atob(
			repository.readme,
		);
		const content = await openInEditor(
			`temp_readme_${repository.owner_login}_${repository.name}.md`,
			initContent,
		).catch((err: string) => {
			toast.error(err);
			return null;
		});

		if (content === null) {
			return;
		}

		// const id = enqueueSnackbar(
		// 	"Updating repository README...",
		// 	{
		// 		variant: "info",
		// 		persist: true,
		// 	},
		// );
		await putRepositoryReadme(
			repository.owner_login,
			repository.name,
			content,
		);
		// .then(
		// 	() =>
		// 		enqueueSnackbar("Update complete", {
		// 			variant: "success",
		// 		}),
		// 	(err) =>
		// 		enqueueSnackbar(String(err), {
		// 			variant: "error",
		// 			persist: true,
		// 		}),
		// );
		// closeSnackbar(id);
	};

	return updateReadme;
};
