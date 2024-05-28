import { IconButton } from "@mui/material";
import { FC, ReactNode } from "react";

type StyledIconButtonProps = {
	submit?: boolean;
	disabled?: boolean;
	children: ReactNode;
	onClick?: () => void;
};
export const StyledIconButton: FC<
	StyledIconButtonProps
> = (props) => {
	const { submit, children, onClick, disabled } =
		props;
	const buttonType = submit ? "submit" : "button";
	return (
		<IconButton
			disableTouchRipple
			size="small"
			type={buttonType}
			color="inherit"
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</IconButton>
	);
};
