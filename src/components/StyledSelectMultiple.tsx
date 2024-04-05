import {
	ListSubheader,
	MenuItem,
	Select,
	SelectProps,
} from "@mui/material";
import { FC } from "react";

type StyledSelectMultipleProps = Omit<
	SelectProps<string[]>,
	"multiple"
> & {
	options?: { label: string; value: string }[];
	subheader?: string;
};
export const StyledSelectMultiple: FC<
	StyledSelectMultipleProps
> = (props) => {
	const { options, subheader, ...rest } = props;
	const options_ = options ?? [];
	return (
		<Select
			{...rest}
			multiple
		>
			{subheader !== "" &&
				subheader !== undefined && (
					<ListSubheader disableSticky>
						{subheader}
					</ListSubheader>
				)}
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
