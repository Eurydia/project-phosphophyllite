import {
	Button,
	List,
	ListItem,
	ListSubheader,
	TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { ChangeEvent, FC, useState } from "react";
import { WrappableListItem } from "./WrappableListItem";

export const SettingRegionAPI: FC = () => {
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
			<WrappableListItem
				primary="Personal access token (classic)"
				secondary="Without repository permission, the private repositories will be invisible."
			>
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
