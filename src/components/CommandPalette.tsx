import {
	Autocomplete,
	Dialog,
	ListItemText,
	MenuItem,
	TextField,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import {
	signalOpenSecretDir,
	singalOpenSettingFile,
} from "~signals/open";
type Command = {
	label: string;
	action: () => void;
	description: string | null;
};

const COMMANDS: Command[] = [
	{
		label: "Open settings.json",
		action: () => singalOpenSettingFile(),
		description: null,
	},
	{
		label: "Open secret directory",
		action: () => signalOpenSecretDir(),
		description: null,
	},
];

export const CommandPalette: FC = () => {
	const [open, setOpen] = useState(false);
	const [value, setValue] =
		useState<Command | null>(null);

	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (!event.ctrlKey) {
				return;
			}
			if (event.key === "p") {
				event.preventDefault();
				setOpen(true);
			}
		};
		document.addEventListener("keydown", handler);
		return () =>
			document.removeEventListener(
				"keydown",
				handler,
			);
	});
	return (
		<Dialog
			// hideBackdrop
			fullWidth
			maxWidth="md"
			open={open}
			onClose={() => setOpen(false)}
			sx={{
				"& .MuiDialog-container": {
					alignItems: "flex-start",
				},
			}}
		>
			<Autocomplete
				clearOnEscape
				autoFocus
				freeSolo
				fullWidth
				openOnFocus
				disableClearable
				disableCloseOnSelect
				onKeyDown={(event) => {
					if (event.key === "Escape") {
						setOpen(false);
					}
				}}
				onChange={async (_, newValue) => {
					setOpen(false);
					const v = newValue as Command | null;
					if (v) {
						v.action();
					}
				}}
				componentsProps={{
					paper: {
						square: true,
						elevation: 0,
					},
				}}
				renderInput={(props) => (
					<TextField
						{...props}
						variant="filled"
						autoFocus
						fullWidth
					/>
				)}
				options={COMMANDS}
				renderOption={(props, option) => (
					<MenuItem
						{...props}
						key={option.label}
					>
						<ListItemText
							primary={option.label}
							secondary={option.description}
						/>
					</MenuItem>
				)}
			/>
		</Dialog>
	);
};
