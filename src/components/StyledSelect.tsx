import {
	MenuItem,
	Select,
	SelectProps,
} from "@mui/material";
import { FC } from "react";

type StyledSelectProps = SelectProps<string> & {
	options?: { label: string; value: string }[];
};
export const StyledSelect: FC<
	StyledSelectProps
> = (props) => {
	const { options, ...rest } = props;
	const options_ = options ?? [];
	return (
		<Select {...rest}>
			{options_.map(({ value, label }, index) => (
				<MenuItem
					disableRipple
					key={`${value}-${index}`}
					value={value}
				>
					{label}
				</MenuItem>
			))}
		</Select>
	);
};
