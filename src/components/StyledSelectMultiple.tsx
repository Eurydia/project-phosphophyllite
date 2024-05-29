import {
	ArrowDropDownRounded,
	ClearRounded,
} from "@mui/icons-material";
import {
	MenuItem,
	Select,
	SelectChangeEvent,
	SelectProps,
	Stack,
	useTheme,
} from "@mui/material";
import { FC } from "react";
import { SelectOption } from "~types/generic";
import { StyledIconButton } from "./StyledIconButton";

type StyledSelectMultipleProps = Omit<
	SelectProps<string[]>,
	"multiple" | "onChange"
> & {
	options?: SelectOption<string>[];
	onChange: (items: string[]) => void;
};
export const StyledSelectMultiple: FC<
	StyledSelectMultipleProps
> = (props) => {
	const { options, onChange, ...rest } = props;
	const { palette } = useTheme();
	const opt = options ?? [];
	const icon = () => {
		return (
			<ArrowDropDownRounded
				fontSize="large"
				htmlColor={palette.text.primary}
			/>
		);
	};
	const handleChange = (
		event: SelectChangeEvent<string[]>,
	) => {
		const values = event.target.value
			.toString()
			.split(",");
		onChange(values);
	};
	const handleClear = () => {
		onChange([]);
	};
	const disableClear =
		rest.disabled || opt.length === 0;

	return (
		<Stack
			width="100%"
			direction="row"
			alignItems="center"
		>
			<Select
				{...rest}
				multiple
				fullWidth
				displayEmpty
				size="small"
				IconComponent={icon}
				onChange={handleChange}
			>
				{opt.map(({ value, label }, index) => (
					<MenuItem
						key={`item-${index}`}
						disableRipple
						value={value}
					>
						{label}
					</MenuItem>
				))}
			</Select>
			<StyledIconButton
				disabled={disableClear}
				onClick={handleClear}
			>
				<ClearRounded />
			</StyledIconButton>
		</Stack>
	);
};
