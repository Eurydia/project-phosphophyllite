import {
	Button,
	Divider,
	List,
	ListItem,
	ListItemText,
	ListSubheader,
	SelectChangeEvent,
	Stack,
	TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import {
	ChangeEvent,
	FC,
	ReactNode,
	useMemo,
	useState,
} from "react";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { StyledSelect } from "~components/StyledSelect";
import {
	ISSUE_FILTER_OWNER_TYPE_OPTIONS,
	ISSUE_FILTER_STATE_OPTIONS,
	REPO_FILTER_STATUS_OPTIONS,
	REPO_FILTER_TOPIC_MATCH_STRATEGY_OPTIONS,
	REPO_FILTER_VISIBILITY_OPTIONS,
} from "~constants";
import { normalizeDateString } from "~core/time";
import {
	syncCachedRepoIssueComments,
	syncCachedRepoIssues,
	syncCachedRepos,
} from "~database/cached";
import {
	getIssueFilterPrefOwnerType,
	getIssueFilterPrefState,
	getRepoFilterPrefStatus,
	getRepoFilterPrefTopicMatchStrategy,
	getRepoFilterPrefVisibility,
	setIssueFilterPrefOwnerType,
	setIssueFilterPrefState,
	setRepoFilterPrefStatus,
	setRepoFilterPrefTopicMatchStrategy,
	setRepoFilterPrefVisibility,
} from "~database/preferences";
import { WithAppBar } from "~views/WithAppBar";

type WrappableListItemProps = {
	children?: ReactNode;
	primary?: string;
	secondary?: string;
};
const WrappableListItem: FC<
	WrappableListItemProps
> = (props) => {
	const { secondary, primary, children } = props;
	return (
		<ListItem disableGutters>
			<Stack
				width="100%"
				display="flex"
				flexDirection="row"
				flexWrap="wrap"
				alignItems="start"
				justifyContent="space-between"
			>
				<ListItemText
					primary={primary}
					secondary={secondary}
					sx={{
						width: "max(200px, 40%)",
					}}
				/>
				<Stack
					alignItems="center"
					flexDirection="row"
					minWidth="max(200px, 25%)"
				>
					{children}
				</Stack>
			</Stack>
		</ListItem>
	);
};

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
			<WrappableListItem primary="Personal access token (classic)">
				<TextField
					fullWidth
					placeholder="ghp_"
					type="password"
					value={personalAccessToken}
					onChange={handlePasswordChange}
					size="small"
				/>
			</WrappableListItem>
			<ListItem disableGutters>
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
			}
		});
	};
	const handleSyncIssues = () => {
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
			}
		});
	};

	const handleSyncComments = () => {
		syncCachedRepoIssueComments((err) => {
			enqueueSnackbar({
				message: String(err),
				variant: "error",
			});
		}).then((res) => {
			if (res.every((v) => v)) {
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
			<WrappableListItem
				primary="Sync repositories"
				secondary={lastSyncRepos}
			>
				<Button
					fullWidth
					disableElevation
					disabled={disableSync}
					size="small"
					variant="contained"
					onClick={handleSyncRepos}
				>
					Sync repositories
				</Button>
			</WrappableListItem>
			<WrappableListItem
				primary="Sync issues"
				secondary={lastSyncIssues}
			>
				<Button
					fullWidth
					disableElevation
					disabled={disableSync}
					size="small"
					variant="contained"
					onClick={handleSyncIssues}
				>
					Sync issues
				</Button>
			</WrappableListItem>
			<WrappableListItem
				primary="Sync comments"
				secondary={lastSyncComments}
			>
				<Button
					fullWidth
					disableElevation
					disabled={disableSync}
					size="small"
					variant="contained"
					onClick={handleSyncComments}
				>
					Sync Comments
				</Button>
			</WrappableListItem>
		</List>
	);
};

const SettingsRepoFilterPref: FC = () => {
	const [mode, setMode] = useState(
		getRepoFilterPrefTopicMatchStrategy(),
	);
	const [visibility, setVisibility] = useState(
		getRepoFilterPrefVisibility(),
	);
	const [status, setStatus] = useState(
		getRepoFilterPrefStatus(),
	);

	const handleTopicMatchStrategyChange = (
		event: SelectChangeEvent<string>,
	) => {
		const value = event.target.value;
		setRepoFilterPrefTopicMatchStrategy(value);
		setMode(value);
	};
	const handleVisiblityChange = (
		event: SelectChangeEvent<string>,
	) => {
		const value = event.target.value;
		setRepoFilterPrefVisibility(value);
		setVisibility(value);
	};
	const handleStatusChange = (
		event: SelectChangeEvent<string>,
	) => {
		const value = event.target.value;
		setRepoFilterPrefStatus(value);
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
					Repository filter preferences
				</ListSubheader>
			}
		>
			<WrappableListItem primary="Match strategy">
				<StyledSelect
					fullWidth
					displayEmpty
					size="small"
					value={mode}
					options={
						REPO_FILTER_TOPIC_MATCH_STRATEGY_OPTIONS
					}
					onChange={
						handleTopicMatchStrategyChange
					}
				/>
			</WrappableListItem>
			<WrappableListItem primary="Visibility">
				<StyledSelect
					fullWidth
					displayEmpty
					size="small"
					value={visibility}
					options={REPO_FILTER_VISIBILITY_OPTIONS}
					onChange={handleVisiblityChange}
				/>
			</WrappableListItem>
			<WrappableListItem primary="Status">
				<StyledSelect
					fullWidth
					displayEmpty
					size="small"
					value={status}
					options={REPO_FILTER_STATUS_OPTIONS}
					onChange={handleStatusChange}
				/>
			</WrappableListItem>
		</List>
	);
};

const SettingsIssueFilterPref: FC = () => {
	const [ownerType, setOwnerType] = useState(
		getIssueFilterPrefOwnerType(),
	);
	const [state, setState] = useState(
		getIssueFilterPrefState(),
	);

	const handleOwnerTypeChange = (
		event: SelectChangeEvent<string>,
	) => {
		const value = event.target.value;
		setIssueFilterPrefOwnerType(value);
		setOwnerType(value);
	};
	const handleStateChange = (
		event: SelectChangeEvent<string>,
	) => {
		const value = event.target.value;
		setIssueFilterPrefState(value);
		setState(value);
	};

	return (
		<List
			disablePadding
			subheader={
				<ListSubheader
					disableGutters
					disableSticky
				>
					Issue filter preferences
				</ListSubheader>
			}
		>
			<WrappableListItem primary="Owner type">
				<StyledSelect
					fullWidth
					displayEmpty
					size="small"
					value={ownerType}
					options={
						ISSUE_FILTER_OWNER_TYPE_OPTIONS
					}
					onChange={handleOwnerTypeChange}
				/>
			</WrappableListItem>
			<WrappableListItem primary="State">
				<StyledSelect
					fullWidth
					displayEmpty
					size="small"
					value={state}
					options={ISSUE_FILTER_STATE_OPTIONS}
					onChange={handleStateChange}
				/>
			</WrappableListItem>
		</List>
	);
};

export const SettingsPage: FC = () => {
	return (
		<WithAppBar
			location={
				<StyledBreadcrumbs paths="~/settings" />
			}
		>
			<Stack
				paddingTop={2}
				paddingX={2}
				spacing={1}
				divider={<Divider variant="middle" />}
			>
				<SettingsRepoFilterPref />
				<SettingsIssueFilterPref />
				<SettingsAPI />
				<SettingsSync />
			</Stack>
		</WithAppBar>
	);
};
