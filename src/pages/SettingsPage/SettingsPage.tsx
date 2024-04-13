import {
	Button,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	ListSubheader,
	TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { ChangeEvent, FC, useState } from "react";
import { WithAppBar } from "~views/WithAppBar";

export const SettingsPage: FC = () => {
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
			message: "Updated personal access token.",
			variant: "info",
		});
	};

	return (
		<WithAppBar location="Settings">
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
			</List>
			<Button
				size="small"
				variant="contained"
				onClick={commitChanges}
			>
				Update
			</Button>
		</WithAppBar>
	);
};
