import {
	TextField,
	TextFieldProps,
} from "@mui/material";
import { ChangeEvent, FC } from "react";

type StyledTextFieldProps = Omit<
	TextFieldProps,
	"onChange"
> & {
	onChange?: (v: string) => void;
};
export const StyledTextField: FC<
	StyledTextFieldProps
> = (props) => {
	const { onChange, ...rest } = props;

	const handleChange = (
		e: ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement
		>,
	) => {
		if (onChange !== undefined) {
			onChange(e.target.value.normalize());
		}
	};

	return (
		<TextField
			{...rest}
			fullWidth
			type="text"
			size="small"
			autoSave="off"
			autoCorrect="off"
			autoComplete="off"
			onChange={handleChange}
		/>
	);
};
