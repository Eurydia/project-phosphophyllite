import {
	Button,
	CircularProgress,
	List,
	ListSubheader,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { FC, useMemo, useState } from "react";
import { normalizeDateString } from "~core/time";
import {
	syncCachedRepoIssueComments,
	syncCachedRepoIssues,
	syncCachedRepos,
} from "~database/cached";
import { WrappableListItem } from "./WrappableListItem";

const SYNC_DETAILS: {
	key: string;
	successMsg: string;
	promise: (
		onFailure: (err: any) => void,
	) => Promise<boolean[]>;
}[] = [
	{
		key: "last-sync-repos",
		successMsg: "repsitories",
		promise: (onFailure) =>
			syncCachedRepos(onFailure),
	},
	{
		key: "last-sync-issues",
		successMsg: "issues",
		promise: (onFailure) =>
			syncCachedRepoIssues(onFailure),
	},
	{
		key: "last-sync-comments",
		successMsg: "comments",
		promise: (onFailure) =>
			syncCachedRepoIssueComments(onFailure),
	},
];

const LAST_SYNC = [
	normalizeDateString(
		localStorage.getItem("last-sync-repos"),
		"Never",
	),
	normalizeDateString(
		localStorage.getItem("last-sync-issues"),
		"Never",
	),
	normalizeDateString(
		localStorage.getItem("last-sync-comments"),
		"Never",
	),
];

export const SettingRegionSync: FC = () => {
	const { enqueueSnackbar } = useSnackbar();

	const savedToken =
		localStorage.getItem(
			"personal-access-token",
		) ?? "";

	const [syncing, setSyncing] = useState<
		boolean[]
	>([false, false, false]);
	const [lastSyncs, setLastSync] =
		useState(LAST_SYNC);

	const enqueueError = (err: any) => {
		enqueueSnackbar({
			message: String(err),
			variant: "error",
		});
		throw err;
	};

	const handleSync = async (index: number) => {
		setSyncing((prev) => {
			const next = [...prev];
			next[index] = true;
			return next;
		});

		const { promise, successMsg, key } =
			SYNC_DETAILS[index];
		const res = await promise(enqueueError);
		if (res.every((r) => r)) {
			enqueueSnackbar({
				message: `Synced ${successMsg}`,
				variant: "success",
			});
			const timestamp = new Date(
				Date.now(),
			).toISOString();
			localStorage.setItem(key, timestamp);
			setLastSync((prev) => {
				const next = [...prev];
				next[index] =
					normalizeDateString(timestamp);
				return next;
			});
		}
		setSyncing((prev) => {
			const next = [...prev];
			next[index] = false;
			return next;
		});
	};
	const disableSync = useMemo(() => {
		return !Boolean(savedToken);
	}, [savedToken]);

	return (
		<List
			disablePadding
			subheader={
				<ListSubheader
					disableGutters
					disableSticky
				>
					Synchronization
				</ListSubheader>
			}
		>
			{SYNC_DETAILS.map(
				({ successMsg }, index) => (
					<WrappableListItem
						key={`sync-item-${index}`}
						primary={`Sync ${successMsg}`}
						secondary={`Last sync: ${lastSyncs[index]}`}
					>
						<Button
							fullWidth
							disableElevation
							disabled={
								disableSync || syncing[index]
							}
							size="small"
							variant="contained"
							onClick={() => handleSync(index)}
						>
							{syncing[index] ? (
								<CircularProgress
									disableShrink
									size={28}
								/>
							) : (
								`Sync ${successMsg}`
							)}
						</Button>
					</WrappableListItem>
				),
			)}
		</List>
	);
};
