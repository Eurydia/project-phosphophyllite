import {
	FC,
	Fragment,
	useRef,
	useState,
} from "react";

import {
	Button,
	ButtonProps,
	Popover,
	PopoverProps,
} from "@mui/material";

type PopoverButtonProps = Omit<
	PopoverProps,
	"open"
> & {
	buttonProps: ButtonProps;
};

export const PopoverButton: FC<
	PopoverButtonProps
> = (props) => {
	const { buttonProps, ...popoverProps } = props;

	const buttonRef =
		useRef<HTMLButtonElement | null>(null);
	const [menuAnchor, setMenuAnchor] =
		useState<HTMLButtonElement | null>(null);

	return (
		<Fragment>
			<Button
				{...buttonProps}
				ref={buttonRef}
				onClick={() =>
					setMenuAnchor(buttonRef.current)
				}
			>
				Sort
			</Button>
			<Popover
				{...popoverProps}
				anchorEl={menuAnchor}
				open={menuAnchor !== null}
				onClose={() => setMenuAnchor(null)}
			/>
		</Fragment>
	);
};
