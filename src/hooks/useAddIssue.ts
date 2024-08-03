import { useSnackbar } from "notistack";
import { postIssue } from "~tauri/github/post";
import { openInDefaultEditor } from "~tauri/temp";
import { AppRepository } from "~types/models";

export const useAddIssue = () => {
	const { closeSnackbar, enqueueSnackbar } =
		useSnackbar();

	const addIssue = async (
		repository: AppRepository,
	) => {
		const updatedContent =
			await openInDefaultEditor(
				`temp_issue_${repository.owner_login}_${repository.name}.md`,
				"",
			).catch((err) => {
				enqueueSnackbar(String(err), {
					variant: "error",
					persist: true,
				});
				return null;
			});

		if (updatedContent === null) {
			return;
		}

		const id = enqueueSnackbar(
			"Adding issue...",
			{
				variant: "info",
				persist: true,
			},
		);
		await postIssue(
			repository.owner_login,
			repository.name,
			updatedContent,
		).then(
			() =>
				enqueueSnackbar("Add complete", {
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

	return addIssue;
};
