import {
	MenuItem,
	Select,
	SelectChangeEvent,
} from "@mui/material";
import { SelectOption } from "~types/generic";

type StyledSelectProps<T> = {
	label: string;
	name: string;
	value: string;
	options: SelectOption<T>[];
	onChange: (value: T) => void;
};
export const StyledSelect = <T extends string>(
	props: StyledSelectProps<T>,
) => {
	const {
		name,
		label,
		options,
		onChange,
		value,
	} = props;

	const handleChange = (
		event: SelectChangeEvent<string>,
	) => {
		onChange(event.target.value as T);
	};
	const renderValue = (v: string) => {
		const selected = options.filter(
			(opt) => opt.value === v,
		);
		let l = "";
		if (selected.length > 0) {
			l = selected[0].label;
		}
		return `${label}: ${l}`;
	};
	return (
		<Select
			fullWidth
			displayEmpty
			size="small"
			name={name}
			value={value}
			onChange={handleChange}
			renderValue={renderValue}
			MenuProps={{
				elevation: 1,
			}}
		>
			{options.map(({ value, label }, index) => (
				<MenuItem
					key={`opt-${index}`}
					disableRipple
					value={value}
				>
					{label}
				</MenuItem>
			))}
		</Select>
	);
};
