import { useSnackbar } from "notistack";
import {
	useEffect,
	useRef,
	useState,
} from "react";
import { updateCachedRepos } from "resources/cached";
import {
	getSyncData,
	setSyncData,
} from "resources/settings";
import { SyncData } from "~types/query";

export const useSync = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [syncStates, setSyncStates] = useState([
		false,
		false,
		false,
	]);

	const [_lastSync, setLastSync] = useState<
		SyncData | undefined
	>(undefined);

	useEffect(() => {
		(async () => {
			const data = await getSyncData();
			setLastSync(data);
		})();
	}, []);

	useEffect(() => {
		if (_lastSync === undefined) {
			return;
		}
		(async () => {
			setSyncData(_lastSync);
		})();
	}, [_lastSync]);

	const enqueueError = (err: any) => {
		enqueueSnackbar({
			message: String(err),
			variant: "error",
		});
		throw err;
	};

	const updateRepos = async () => {
		await handleSync(0, "Repository");
		setLastSync((prev) => {
			if (prev === undefined) {
				return;
			}
			const next = { ...prev };
			next["repoLastSync"] = new Date(
				Date.now(),
			).toISOString();
			return next;
		});
	};
	const updateIssues = async () => {
		await handleSync(1, "Issue");
		setLastSync((prev) => {
			if (prev === undefined) {
				return;
			}
			const next = { ...prev };
			next["issueLastSync"] = new Date(
				Date.now(),
			).toISOString();
			return next;
		});
	};
	const updateComments = async () => {
		await handleSync(2, "Comment");
		setLastSync((prev) => {
			if (prev === undefined) {
				return;
			}
			const next = { ...prev };
			next["commentLastSync"] = new Date(
				Date.now(),
			).toISOString();
			return next;
		});
	};

	const handleSync = async (
		index: number,
		item: string,
	) => {
		setSyncStates((prev) => {
			const next = [...prev];
			next[index] = true;
			return next;
		});
		const status = await updateCachedRepos()
			.then(() => true)
			.catch((err) => {
				enqueueError(err);
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

	const syncFn = useRef([
		updateRepos,
		updateIssues,
		updateComments,
	]);

	const itemText = useRef<string[]>([
		"repositories",
		"issues",
		"comments",
	]);

	let lastSync = ["Never", "Never", "Never"];
	if (_lastSync !== undefined) {
		lastSync = [
			_lastSync["repoLastSync"],
			_lastSync["issueLastSync"],
			_lastSync["commentLastSync"],
		];
	}

	return {
		lastSync,
		itemText: itemText.current,
		syncStates,
		syncFn: syncFn.current,
	};
};
