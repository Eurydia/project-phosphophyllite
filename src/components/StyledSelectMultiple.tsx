import {
	MenuItem,
	Select,
	SelectProps,
} from "@mui/material";
import { FC } from "react";
import { GenericSelectOption } from "~types/generics";

type StyledSelectMultipleProps = Omit<
	SelectProps<string[]>,
	"multiple"
> & {
	options?: GenericSelectOption<string>[];
};
export const StyledSelectMultiple: FC<
	StyledSelectMultipleProps
> = (props) => {
	const { options: loadedOptions, ...rest } =
		props;

	let options: GenericSelectOption<string>[] = [
		{ label: "No option", value: "No option" },
	];
	let disableOptions = true;
	if (
		loadedOptions !== undefined &&
		loadedOptions.length > 0
	) {
		options = loadedOptions;
		disableOptions = false;
	}
	return (
		<Select
			{...rest}
			multiple
		>
			{options.map(({ value, label }, index) => (
				<MenuItem
					disableRipple
					disabled={disableOptions}
					key={`${value}-${index}`}
					value={value}
				>
					{label}
				</MenuItem>
			))}
		</Select>
	);
};
