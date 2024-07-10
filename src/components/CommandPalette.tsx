import {
	Autocomplete,
	Dialog,
	FilterOptionsState,
	ListItemText,
	MenuItem,
	TextField,
} from "@mui/material";
import { matchSorter } from "match-sorter";
import { FC, useEffect, useState } from "react";
import { useGlobalCommands } from "~hooks/useGlobalCommands";
import { CommandOption } from "~types/generic";

type CommandPaletteProps = {
	localCommands: CommandOption[];
};
export const CommandPalette: FC<
	CommandPaletteProps
> = (props) => {
	const { localCommands } = props;
	const [open, setOpen] = useState(false);

	const globalCommands = useGlobalCommands();

	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === "p") {
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
		const v = newValue as CommandOption;
		v.action();
		setOpen(false);
	};

	const handleKeyDown = (
		event: React.KeyboardEvent<HTMLDivElement>,
	) => {
		if (event.key === "Escape") {
			setOpen(false);
		}
	};

	const filterOptions = (
		options: CommandOption[],
		state: FilterOptionsState<CommandOption>,
	) => {
		if (
			state.inputValue.trimStart().startsWith(">")
		) {
			const filteredOptions = options.filter(
				(option) => option.system,
			);
			return filteredOptions;
		}
		const filteredOptions = options.filter(
			(option) => !option.system,
		);
		return matchSorter(
			filteredOptions,
			state.inputValue,
			{
				keys: ["label", "description"],
			},
		);
	};

	return (
		<Dialog
			hideBackdrop
			fullWidth
			scroll="paper"
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
				clearIcon={null}
				popupIcon={null}
				fullWidth
				disableClearable
				options={[
					...globalCommands,
					...localCommands,
				]}
				onKeyDown={handleKeyDown}
				filterOptions={filterOptions}
				onChange={handleChange}
				noOptionsText="No matching command"
				renderInput={(props) => (
					<TextField
						{...props}
						size="small"
						variant="outlined"
						autoFocus
						fullWidth
					/>
				)}
				renderOption={(props, option, state) => (
					<MenuItem
						{...props}
						selected={state.selected}
						key={`${option.label}-${state.index}`}
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
