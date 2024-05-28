import { ArrowDropDownRounded } from "@mui/icons-material";
import {
	MenuItem,
	Select,
	SelectChangeEvent,
	SelectProps,
	useTheme,
} from "@mui/material";
import { FC } from "react";

type StyledSelectProps = Omit<
	SelectProps<string>,
	"onChange"
> & {
	options?: { label: string; value: string }[];
	onChange: (value: string) => void;
};
export const StyledSelect: FC<
	StyledSelectProps
> = (props) => {
	const { options, onChange, ...rest } = props;
	const { palette } = useTheme();
	const options_ = options ?? [];

	const handleChange = (
		event: SelectChangeEvent<string>,
	) => {
		onChange(event.target.value);
	};

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
			fullWidth
			displayEmpty
			size="small"
			IconComponent={icon}
			onChange={handleChange}
		>
			{options_.map(({ value, label }, index) => (
				<MenuItem
					disableRipple
					key={`item-${index}`}
					value={value}
				>
					{label}
				</MenuItem>
			))}
		</Select>
	);
};
