import {
	TextField,
	TextFieldProps,
} from "@mui/material";
import {
	ChangeEvent,
	FC,
	KeyboardEvent,
} from "react";

type StyledTextFieldProps = Omit<
	TextFieldProps,
	"onChange"
> & {
	onEnter?: () => void;
	onChange?: (v: string) => void;
};
export const StyledTextField: FC<
	StyledTextFieldProps
> = (props) => {
	const { onEnter, onChange, ...rest } = props;

	const handleKeyUp = (
		e: KeyboardEvent<HTMLDivElement>,
	) => {
		if (
			e.key === "Enter" &&
			onEnter !== undefined
		) {
			console.log("entered");
			onEnter();
			return;
		}
	};
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
			onKeyUp={handleKeyUp}
			onChange={handleChange}
		/>
	);
};
