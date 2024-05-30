import { useSnackbar } from "notistack";
import { useState } from "react";
import {
	updateCachedComments,
	updateCachedIssues,
	updateCachedRepos,
} from "resources/cached";

export const useSync = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [syncStates, setSyncStates] = useState([
		false,
		false,
		false,
	]);

	const handleUpdateRepos = async () => {
		await handleUpdate(
			0,
			"Repository",
			updateCachedRepos,
		);
	};
	const handleUpdateIssues = async () => {
		await handleUpdate(
			1,
			"Issue",
			updateCachedIssues,
		);
	};
	const handleUpdateComments = async () => {
		await handleUpdate(
			2,
			"Comment",
			updateCachedComments,
		);
	};
	const handleUpdate = async (
		index: number,
		item: string,
		callback: () => Promise<void>,
	) => {
		setSyncStates((prev) => {
			const next = [...prev];
			next[index] = true;
			return next;
		});
		const status = await callback()
			.then(() => true)
			.catch((err) => {
				enqueueSnackbar({
					message: String(err),
					variant: "error",
				});
				return false;
			})
			.finally(() => {
				setSyncStates((prev) => {
					const next = [...prev];
					next[index] = false;
					return next;
				});
			});
		if (!status) {
			return;
		}
		enqueueSnackbar({
			message: `${item} data is up to date.`,
			variant: "success",
		});
	};

	const syncFn = [
		handleUpdateRepos,
		handleUpdateIssues,
		handleUpdateComments,
	];

	const itemText = [
		"repositories",
		"issues",
		"comments",
	];

	return {
		itemText,
		syncStates,
		syncFn,
	};
};
