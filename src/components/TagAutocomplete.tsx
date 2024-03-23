import {
	Autocomplete,
	TextField,
} from "@mui/material";
import { FC } from "react";

type StyledAutocompleteProps = {
	fullWidth?: boolean;
	width?: string;
	options: string[];
	value: string[];
	onChange: (value: string[]) => void;
};
export const StyledAutocomplete: FC<
	StyledAutocompleteProps
> = (props) => {
	const {
		width,
		fullWidth,
		options,
		value,
		onChange,
	} = props;

	return (
		<Autocomplete
			freeSolo
			fullWidth={fullWidth}
			multiple
			limitTags={3}
			size="small"
			options={options}
			value={value}
			onChange={(_, values) => onChange(values)}
			renderInput={(params) => (
				<TextField
					{...params}
					label="Tags"
					size="small"
				/>
			)}
			sx={{
				width,
			}}
		/>
	);
};
