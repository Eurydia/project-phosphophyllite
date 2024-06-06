import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { setDataMisc } from "resources/data";
import {
	updateCachedComments,
	updateCachedIssues,
	updateCachedRepos,
} from "~database/cached";
import { MiscData } from "~types/schema";

export const useUpdateCached = (
	init: MiscData,
) => {
	const { enqueueSnackbar } = useSnackbar();
	const [appData, setAppData] = useState(init);

	useEffect(() => {
		(async () => {
			await setDataMisc(appData);
		})();
	}, [appData]);

	const [isBusy, setIsBusy] = useState([
		false,
		false,
		false,
	]);

	const handleUpdate = async (
		index: number,
		item: string,
		callback: () => Promise<void>,
	) => {
		setIsBusy((prev) => {
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
				setIsBusy((prev) => {
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
		setAppData((prev) => {
			const next = { ...prev };
			const time = new Date(Date.now());
			const timeUTC = time.toUTCString();
			switch (index) {
				case 0:
					next["repoDataLastUpdate"] = timeUTC;
					break;
				case 1:
					next["issueDataLastUpdate"] = timeUTC;
					break;
				case 2:
					next["commentDataLastUpdate"] = timeUTC;
					break;
			}
			return next;
		});
	};

	const items: {
		label: string;
		callback: () => Promise<void>;
		isBusy: boolean;
		lastUpdated?: string;
	}[] = [
		{
			label: "Update repositories",
			callback: () =>
				handleUpdate(
					0,
					"Repository",
					updateCachedRepos,
				),
			isBusy: isBusy[0],
			lastUpdated: appData.repoDataLastUpdate,
		},
		{
			label: "Update Issues",
			callback: () =>
				handleUpdate(
					1,
					"Issue",
					updateCachedIssues,
				),
			isBusy: isBusy[1],
			lastUpdated: appData.issueDataLastUpdate,
		},
		{
			label: "Update comments",
			callback: () =>
				handleUpdate(
					2,
					"Comment",
					updateCachedComments,
				),
			isBusy: isBusy[2],
			lastUpdated: appData.commentDataLastUpdate,
		},
	];

	return items;
};
