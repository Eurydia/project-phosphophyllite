import { FilterOptionsState } from "@mui/material";
import { matchSorter } from "match-sorter";
import { CommandOption } from "~types/generic";

export const filterCommandPaletteOption = (
	options: CommandOption[],
	state: FilterOptionsState<CommandOption>,
	systemTriggerPrefix: string = ">",
) => {
	const isInSystemMode = state.inputValue
		.trimStart()
		.startsWith(systemTriggerPrefix);

	let filteredOptions: CommandOption[] = [];
	if (isInSystemMode) {
		filteredOptions = options.filter(
			(option) => option.system,
		);
	} else {
		filteredOptions = options.filter(
			(option) => !option.system,
		);
	}

	const sortedOptions = matchSorter(
		filteredOptions,
		state.inputValue.slice(
			systemTriggerPrefix.length,
		),
		{
			keys: ["searchTokens", "label"],
		},
	);

	return sortedOptions;
};
