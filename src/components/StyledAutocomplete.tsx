import {
	Autocomplete,
	SxProps,
	TextField,
	TextFieldProps,
} from "@mui/material";
import { FC, SyntheticEvent } from "react";

type StyledAutocompleteProps = {
	options: string[];
	value: string[];
	onChange?: (value: string[]) => void;
	sx?: SxProps;
	textFieldProps?: TextFieldProps;
};
export const StyledAutocomplete: FC<
	StyledAutocompleteProps
> = (props) => {
	const { textFieldProps, onChange, ...rest } =
		props;

	const handleChange = (
		_: SyntheticEvent<Element | Event>,
		value: string[],
	) => {
		if (onChange !== undefined) {
			onChange(value);
		}
	};

	return (
		<Autocomplete
			{...rest}
			multiple
			freeSolo
			onChange={handleChange}
			renderInput={(params) => (
				<TextField
					{...params}
					{...textFieldProps}
				/>
			)}
		/>
	);
};
