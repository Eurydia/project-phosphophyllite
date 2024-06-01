import {
	IconButton,
	IconButtonProps,
} from "@mui/material";
import { FC } from "react";

export const StyledIconButton: FC<
	IconButtonProps
> = (props) => {
	return (
		<IconButton
			{...props}
			disableTouchRipple
			size="small"
			color="inherit"
		/>
	);
};
