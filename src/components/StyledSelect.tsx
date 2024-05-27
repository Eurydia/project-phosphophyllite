import { ArrowDropDownRounded } from "@mui/icons-material";
import {
	MenuItem,
	Select,
	SelectProps,
	useTheme,
} from "@mui/material";
import { FC } from "react";

type StyledSelectProps = SelectProps<string> & {
	options?: { label: string; value: string }[];
};
export const StyledSelect: FC<
	StyledSelectProps
> = (props) => {
	const { options, ...rest } = props;
	const { palette } = useTheme();
	const options_ = options ?? [];

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
