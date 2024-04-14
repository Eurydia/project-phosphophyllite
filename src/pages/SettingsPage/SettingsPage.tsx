import {
	Button,
	Divider,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	ListSubheader,
	SelectChangeEvent,
	Stack,
	TextField,
} from "@mui/material";
import {
	FILTER_MODE_OPTIONS,
	FILTER_STATUS_OPTIONS,
	FILTER_VISIBILITY_OPTIONS,
} from "constants/filterOptions";
import { useSnackbar } from "notistack";
import {
	ChangeEvent,
	FC,
	useMemo,
	useState,
} from "react";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { StyledSelect } from "~components/StyledSelect";
import { normalizeDateString } from "~core/time";
import {
	syncCachedRepoIssueComments,
	syncCachedRepoIssues,
	syncCachedRepos,
} from "~database/cached";
import {
	getRepoFilterStatus,
	getRepoFilterTopicMode,
	getRepoFilterVisibility,
} from "~database/preferences";
import { WithAppBar } from "~views/WithAppBar";

const SettingsAPI: FC = () => {
	const { enqueueSnackbar } = useSnackbar();

	const [
		personalAccessToken,
		setPersonalAccessToken,
	] = useState(
		localStorage.getItem(
			"personal-access-token",
		) ?? "",
	);

	const handlePasswordChange = (
		event: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement
		>,
	) => {
		const value = event.target.value.normalize();
		setPersonalAccessToken(value);
	};

	const commitChanges = () => {
		localStorage.setItem(
			"personal-access-token",
			personalAccessToken,
		);
		enqueueSnackbar({
			message: "Updated personal access token",
			variant: "info",
		});
	};

	return (
		<List
			disablePadding
			subheader={
				<ListSubheader
					disableGutters
					disableSticky
				>
					API
				</ListSubheader>
			}
		>
			<ListItem>
				<ListItemText primary="Personal access token (classic)" />
				<ListItemSecondaryAction>
					<TextField
						placeholder="ghp_"
						type="password"
						value={personalAccessToken}
						onChange={handlePasswordChange}
						size="small"
					/>
				</ListItemSecondaryAction>
			</ListItem>
			<ListItem>
				<Button
					disableElevation
					size="small"
					variant="contained"
					onClick={commitChanges}
				>
					Update
				</Button>
			</ListItem>
		</List>
	);
};

const SettingsSync: FC = () => {
	const { enqueueSnackbar } = useSnackbar();

	const savedToken =
		localStorage.getItem(
			"personal-access-token",
		) ?? "";

	const [lastSyncRepos, setLastSyncRepos] =
		useState(() => {
			const date = normalizeDateString(
				localStorage.getItem("last-sync-repos"),
				"Never",
			);
			return `Last sync: ${date}`;
		});
	const [lastSyncIssues, setLastSyncIssues] =
		useState(() => {
			const date = normalizeDateString(
				localStorage.getItem("last-sync-issues"),
				"Never",
			);
			return `Last sync: ${date}`;
		});
	const [lastSyncComments, setLastSyncComments] =
		useState(() => {
			const date = normalizeDateString(
				localStorage.getItem(
					"last-sync-comments",
				),
				"Never",
			);
			return `Last sync: ${date}`;
		});

	const handleSyncRepos = () => {
		const timestamp = new Date(
			Date.now(),
		).toISOString();
		localStorage.setItem(
			"last-sync-repos",
			timestamp,
		);
		setLastSyncRepos(
			`Last sync: ${normalizeDateString(
				timestamp,
			)}`,
		);
		syncCachedRepos((err) => {
			enqueueSnackbar({
				message: String(err),
				variant: "error",
			});
			throw err;
		}).then((res) => {
			if (res) {
				enqueueSnackbar({
					message: "Synced repositories",
					variant: "success",
				});
			}
		});
	};
	const handleSyncIssues = () => {
		const timestamp = new Date(
			Date.now(),
		).toISOString();
		localStorage.setItem(
			"last-sync-issues",
			timestamp,
		);
		setLastSyncIssues(
			`Last sync: ${normalizeDateString(
				timestamp,
			)}`,
		);
		syncCachedRepoIssues((err) => {
			enqueueSnackbar({
				message: String(err),
				variant: "error",
			});
			throw err;
		}).then((res) => {
			if (res.every((v) => v)) {
				enqueueSnackbar({
					message: "Synced issues",
					variant: "success",
				});
			}
		});
	};

	const handleSyncComments = () => {
		const timestamp = new Date(
			Date.now(),
		).toISOString();
		setLastSyncComments(
			`Last sync: ${normalizeDateString(
				timestamp,
			)}`,
		);
		localStorage.setItem(
			"last-sync-comments",
			timestamp,
		);
		syncCachedRepoIssueComments((err) => {
			enqueueSnackbar({
				message: String(err),
				variant: "error",
			});
		}).then((res) => {
			if (res.every((v) => v)) {
				enqueueSnackbar({
					message: "Synced comments",
					variant: "success",
				});
			}
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
			<ListItem>
				<ListItemText secondary={lastSyncRepos}>
					Sync repositories
				</ListItemText>
				<ListItemSecondaryAction>
					<Button
						disableElevation
						disabled={disableSync}
						size="small"
						variant="contained"
						onClick={handleSyncRepos}
					>
						Sync repositories
					</Button>
				</ListItemSecondaryAction>
			</ListItem>
			<ListItem>
				<ListItemText secondary={lastSyncIssues}>
					Sync issues
				</ListItemText>
				<ListItemSecondaryAction>
					<Button
						disableElevation
						disabled={disableSync}
						size="small"
						variant="contained"
						onClick={handleSyncIssues}
					>
						Sync issues
					</Button>
				</ListItemSecondaryAction>
			</ListItem>
			<ListItem>
				<ListItemText
					secondary={lastSyncComments}
				>
					Sync comments
				</ListItemText>
				<ListItemSecondaryAction>
					<Button
						disableElevation
						disabled={disableSync}
						size="small"
						variant="contained"
						onClick={handleSyncComments}
					>
						Sync Comments
					</Button>
				</ListItemSecondaryAction>
			</ListItem>
		</List>
	);
};

const SettingsRepoFilterPref: FC = () => {
	const [mode, setMode] = useState(
		getRepoFilterTopicMode(),
	);
	const [visibility, setVisibility] = useState(
		getRepoFilterVisibility(),
	);
	const [status, setStatus] = useState(
		getRepoFilterStatus(),
	);

	const handleModeChange = (
		event: SelectChangeEvent<string>,
	) => {
		const value = event.target.value;
		localStorage.setItem(
			"repo-filter-topic-mode",
			value,
		);
		setMode(value);
	};
	const handleVisiblityChange = (
		event: SelectChangeEvent<string>,
	) => {
		const value = event.target.value;
		localStorage.setItem(
			"repo-filter-visibility",
			value,
		);
		setVisibility(value);
	};
	const handleStatusChange = (
		event: SelectChangeEvent<string>,
	) => {
		const value = event.target.value;
		localStorage.setItem(
			"repo-filter-status",
			value,
		);
		setStatus(value);
	};

	return (
		<List
			disablePadding
			subheader={
				<ListSubheader
					disableGutters
					disableSticky
				>
					Repositories filter
				</ListSubheader>
			}
		>
			<ListItem>
				<ListItemText>
					Match strategy
				</ListItemText>
				<ListItemSecondaryAction>
					<StyledSelect
						displayEmpty
						subheader="Match strategy"
						size="small"
						value={mode}
						options={FILTER_MODE_OPTIONS}
						onChange={handleModeChange}
					/>
				</ListItemSecondaryAction>
			</ListItem>
			<ListItem>
				<ListItemText>Visibility</ListItemText>
				<ListItemSecondaryAction>
					<StyledSelect
						displayEmpty
						subheader="Visibility"
						size="small"
						value={visibility}
						options={FILTER_VISIBILITY_OPTIONS}
						onChange={handleVisiblityChange}
					/>
				</ListItemSecondaryAction>
			</ListItem>
			<ListItem>
				<ListItemText>Status</ListItemText>
				<ListItemSecondaryAction>
					<StyledSelect
						displayEmpty
						subheader="Status"
						size="small"
						value={status}
						options={FILTER_STATUS_OPTIONS}
						onChange={handleStatusChange}
					/>
				</ListItemSecondaryAction>
			</ListItem>
		</List>
	);
};

export const SettingsPage: FC = () => {
	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs paths="~/Settings" />
			}
		>
			<Stack
				paddingTop={2}
				paddingX={2}
				spacing={1}
				divider={<Divider variant="middle" />}
			>
				<SettingsRepoFilterPref />
				<SettingsAPI />
				<SettingsSync />
			</Stack>
		</WithAppBar>
	);
};
