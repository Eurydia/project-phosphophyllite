import { ArrowDropDownRounded } from "@mui/icons-material";
import {
	MenuItem,
	Select,
	SelectProps,
	useTheme,
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
	const { palette } = useTheme();

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

	const icon = () => {
		return (
			<ArrowDropDownRounded
				fontSize="large"
				htmlColor={palette.text.primary}
			/>
		);
	};
	return (
		<Select
			{...rest}
			multiple
			fullWidth
			displayEmpty
			size="small"
			IconComponent={icon}
		>
			{options.map(({ value, label }, index) => (
				<MenuItem
					disableRipple
					disabled={disableOptions}
					key={`option-${index}`}
					value={value}
				>
					{label}
				</MenuItem>
			))}
		</Select>
	);
};
