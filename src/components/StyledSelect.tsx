import {
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { FC } from "react";
import { SelectOption } from "~types/generic";

type StyledSelectProps = {
	label: string;
	name: string;
	value: string;
	options: SelectOption<string>[];
	onChange: (value: string) => void;
};
export const StyledSelect: FC<
	StyledSelectProps
> = (props) => {
	const { label, options, onChange, value } =
		props;

	const handleChange = (
		event: SelectChangeEvent<string>,
	) => {
		onChange(event.target.value);
	};
	const renderValue = (v: string) => {
		return `${label}: ${v}`;
	};

	return (
		<Select
			fullWidth
			displayEmpty
			size="small"
			value={value}
			onChange={handleChange}
			renderValue={renderValue}
			MenuProps={{
				elevation: 1,
			}}
		>
			{options.map(({ value, label }, index) => (
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
