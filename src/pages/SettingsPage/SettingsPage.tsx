import {
	Button,
	Divider,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	ListSubheader,
	Stack,
	TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import {
	ChangeEvent,
	FC,
	useMemo,
	useState,
} from "react";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { normalizeDateString } from "~core/time";
import {
	syncCachedRepoIssueComments,
	syncCachedRepoIssues,
	syncCachedRepos,
} from "~database/cached";
import { WithAppBar } from "~views/WithAppBar";

export const SettingsPage: FC = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [savedToken, setSavedToken] = useState(
		localStorage.getItem(
			"personal-access-token",
		) ?? "",
	);
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
		setSavedToken(personalAccessToken);
		localStorage.setItem(
			"personal-access-token",
			personalAccessToken,
		);
		enqueueSnackbar({
			message: "Updated personal access token",
			variant: "info",
		});
	};

	const handleSyncRepos = () => {
		localStorage.setItem(
			"last-sync-repos",
			new Date(Date.now()).toISOString(),
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
		localStorage.setItem(
			"last-sync-issues",
			new Date(Date.now()).toISOString(),
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
		localStorage.setItem(
			"last-sync-comments",
			new Date(Date.now()).toISOString(),
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

	const lastSyncRepos = useMemo(() => {
		const date = normalizeDateString(
			localStorage.getItem("last-sync-repos"),
			"Never",
		);
		return `Last sync: ${date}`;
	}, [localStorage.getItem("last-sync-repos")]);

	let lastSyncIssues = normalizeDateString(
		localStorage.getItem("last-sync-issues"),
		"Never",
	);
	lastSyncIssues = `Last sync: ${lastSyncIssues}`;

	let lastSyncComments = normalizeDateString(
		localStorage.getItem("last-sync-comments"),
		"Never",
	);
	lastSyncComments = `Last sync: ${lastSyncComments}`;

	const disableSync = useMemo(() => {
		return !Boolean(savedToken);
	}, [savedToken]);

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
				<List disablePadding>
					<ListSubheader>API</ListSubheader>
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
							size="small"
							variant="contained"
							onClick={commitChanges}
						>
							Update
						</Button>
					</ListItem>
				</List>
				<List disablePadding>
					<ListSubheader>
						Synchronization
					</ListSubheader>
					<ListItem>
						<ListItemText
							secondary={lastSyncRepos}
						>
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
						<ListItemText
							secondary={lastSyncIssues}
						>
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
			</Stack>
		</WithAppBar>
	);
};
