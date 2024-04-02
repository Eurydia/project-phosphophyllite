import {
	Button,
	ButtonProps,
	ClickAwayListener,
	Popper,
	PopperProps,
	useTheme,
} from "@mui/material";
import {
	FC,
	Fragment,
	MouseEvent,
	useState,
} from "react";

type PopperButtonProps = Omit<
	PopperProps,
	"open"
> & {
	buttonProps: ButtonProps;
};

export const PopperButton: FC<
	PopperButtonProps
> = (props) => {
	const { buttonProps, ...popperProps } = props;
	const theme = useTheme();
	const [anchor, setAnchor] =
		useState<HTMLButtonElement | null>(null);

	const handlePopperOpen = (
		event: MouseEvent<HTMLButtonElement>,
	) => {
		setAnchor(event.currentTarget);
	};
	const handlePopperClose = () => {
		setAnchor(null);
	};

	return (
		<Fragment>
			<Button
				{...buttonProps}
				onClick={handlePopperOpen}
			/>
			{anchor !== null && (
				<ClickAwayListener
					onClickAway={handlePopperClose}
				>
					<Popper
						{...popperProps}
						sx={{
							...popperProps.sx,
							zIndex: theme.zIndex.modal,
						}}
						open={anchor !== null}
						anchorEl={anchor}
						placement="bottom-start"
					/>
				</ClickAwayListener>
			)}
		</Fragment>
	);
};
