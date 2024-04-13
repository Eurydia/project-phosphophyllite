import {
	Container,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { ChangeEvent, FC, useState } from "react";
import { WithAppBar } from "~views/WithAppBar";

export const SettingsPage: FC = () => {
	const { enqueueSnackbar } = useSnackbar();
	const [password, setPassword] = useState(
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
		setPassword(value);
		localStorage.setItem(
			"personal-access-token",
			value,
		);
		enqueueSnackbar({
			message: "Updated personal access token",
			variant: "info",
		});
	};

	return (
		<WithAppBar location="Settings">
			<Container maxWidth="sm">
				<List>
					<ListItem>
						<ListItemText primary="Personal access token (classic)" />
						<ListItemSecondaryAction>
							<TextField
								placeholder="ghp_"
								type="password"
								value={password}
								onChange={handlePasswordChange}
								size="small"
							/>
						</ListItemSecondaryAction>
					</ListItem>
				</List>
			</Container>
		</WithAppBar>
	);
};
