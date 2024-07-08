import {
	Autocomplete,
	Dialog,
	ListItemText,
	MenuItem,
	TextField,
} from "@mui/material";
import { matchSorter } from "match-sorter";
import { FC, useEffect, useState } from "react";
import { useSubmit } from "react-router-dom";
import { useCommandsOptions } from "~hooks/useCommandOptions";
import { CommandOption } from "~types/generic";

type Command = {
	label: string;
	action: () => void;
	description: string | null;
};

export const CommandPalette: FC = () => {
	const [open, setOpen] = useState(false);
	const submit = useSubmit();
	const commandsOptions = useCommandsOptions();

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
	}, []);

	const handleChange = async (
		_: any,
		newValue: NonNullable<string | CommandOption>,
	) => {
		const v = newValue as Command;
		v.action();
		setOpen(false);
	};

	return (
		<Dialog
			hideBackdrop
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
				freeSolo
				fullWidth
				disableClearable
				onKeyDown={(event) => {
					if (event.key === "Escape") {
						setOpen(false);
					}
				}}
				filterOptions={(options, state) =>
					matchSorter(options, state.inputValue, {
						keys: ["label"],
					})
				}
				onChange={handleChange}
				renderInput={(props) => (
					<TextField
						{...props}
						size="small"
						variant="outlined"
						autoFocus
						fullWidth
					/>
				)}
				options={commandsOptions}
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
