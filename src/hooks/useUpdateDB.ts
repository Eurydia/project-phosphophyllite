import { useSnackbar } from "notistack";
import { forceUpdateDB } from "~tauri/db/db";

export const useUpdateDB = () => {
	const { enqueueSnackbar, closeSnackbar } =
		useSnackbar();
	const updateDB = async () => {
		const id = enqueueSnackbar(
			"Updating database",
			{
				persist: true,
				variant: "info",
			},
		);
		await forceUpdateDB().then(
			() =>
				enqueueSnackbar("Update completed", {
					variant: "success",
				}),
			(err) =>
				enqueueSnackbar(
					`An error occurred during update: ${String(
						err,
					)}`,
					{
						variant: "error",
					},
				),
		);
		closeSnackbar(id);
	};
	return updateDB;
};
