import {
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { FC } from "react";
import { SelectOption } from "~types/generic";

type StyledSelectProps = {
	name: string;
	label: string;
	value: string;
	options: SelectOption<string>[];
	onChange: (value: string) => void;
};
export const StyledSelect: FC<
	StyledSelectProps
> = (props) => {
	const {
		name,
		options,
		onChange,
		label,
		value,
	} = props;

	const handleChange = (
		event: SelectChangeEvent<string>,
	) => {
		onChange(event.target.value);
	};
	const renderValue = () => {
		return label;
	};

	return (
		<Select
			fullWidth
			displayEmpty
			name={name}
			size="small"
			value={value}
			renderValue={renderValue}
			onChange={handleChange}
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
