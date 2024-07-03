import { useState } from "react";
import {
	updateCachedComments,
	updateCachedIssues,
	updateCachedRepos,
} from "~database/cached";

export const useUpdateCached = () => {
	const [isBusy, setIsBusy] = useState([
		false,
		false,
		false,
	]);

	const handleUpdate = async (
		index: number,
		callback: () => Promise<void>,
	) => {
		setIsBusy((prev) => {
			const next = [...prev];
			next[index] = true;
			return next;
		});
		const status = await callback()
			.then(() => true)
			.catch(() => false)
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
	};
	const items: {
		label: string;
		callback: () => Promise<void>;
		isBusy: boolean;
	}[] = [
		{
			label: "Update repositories",
			callback: () =>
				handleUpdate(0, updateCachedRepos),
			isBusy: isBusy[0],
		},
		{
			label: "Update Issues",
			callback: () =>
				handleUpdate(1, updateCachedIssues),
			isBusy: isBusy[1],
		},
		{
			label: "Update comments",
			callback: () =>
				handleUpdate(2, updateCachedComments),
			isBusy: isBusy[2],
		},
	];

	return items;
};
