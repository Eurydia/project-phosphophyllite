import { Stack, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

type StyledSearchItemProps = {
	children: ReactNode;
	text: string;
};
export const StyledSearchItem: FC<
	StyledSearchItemProps
> = (props) => {
	const { text, children } = props;
	return (
		<Stack
			useFlexGap
			spacing={1}
			flexWrap="wrap"
			direction="row"
			alignItems="center"
			justifyContent="space-between"
		>
			<Typography width="max(200px, 40%)">
				{text}
			</Typography>
			<Stack
				direction="row"
				alignItems="center"
				minWidth="max(200px, 25%)"
			>
				{children}
			</Stack>
		</Stack>
	);
};
