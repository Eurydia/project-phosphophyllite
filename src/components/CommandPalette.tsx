import {
	Autocomplete,
	Dialog,
	DialogContent,
	FilterOptionsState,
	ListItemText,
	MenuItem,
	TextField,
} from "@mui/material";
import { matchSorter } from "match-sorter";
import { FC, useEffect, useState } from "react";
import { CommandOption } from "~types/generic";

type CommandPaletteProps = {
	commands: CommandOption[];
};
export const CommandPalette: FC<
	CommandPaletteProps
> = (props) => {
	const { commands } = props;
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const handleOpen = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === "p") {
				event.preventDefault();
				setOpen(true);
			}
		};
		document.addEventListener(
			"keydown",
			handleOpen,
		);
		return () =>
			document.removeEventListener(
				"keydown",
				handleOpen,
			);
	}, []);

	const handleChange = async (
		_: any,
		value: NonNullable<string | CommandOption>,
	) => {
		const _v = value as CommandOption;
		_v.action();
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
		const isSystemMode = state.inputValue
			.trimStart()
			.startsWith(">");

		const filteredOptions = options.filter(
			(option) =>
				(!isSystemMode && !option.system) ||
				(isSystemMode && option.system),
		);

		return matchSorter(
			filteredOptions,
			state.inputValue.replace(">", ""),
			{
				keys: ["label", "description"],
			},
		);
	};

	return (
		<Dialog
			fullWidth
			maxWidth="md"
			open={open}
			onClose={() => setOpen(false)}
			PaperProps={{
				elevation: 0,
			}}
			sx={{
				"& .MuiDialog-container": {
					alignItems: "flex-start",
				},
			}}
		>
			<DialogContent>
				<Autocomplete
					fullWidth
					disableClearable
					autoComplete
					clearIcon={null}
					popupIcon={null}
					options={commands}
					onKeyDown={handleKeyDown}
					filterOptions={filterOptions}
					onChange={handleChange}
					noOptionsText="No matching command"
					getOptionDisabled={(option) =>
						Boolean(option.disabled)
					}
					renderInput={(props) => (
						<TextField
							{...props}
							autoComplete="on"
							inputRef={(ref) =>
								ref && ref.focus()
							}
							fullWidth
							size="small"
							variant="outlined"
						/>
					)}
					renderOption={(
						props,
						option,
						state,
					) => (
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
			</DialogContent>
		</Dialog>
	);
};
