import { Grid, Stack } from "@mui/material";
import { FC, ReactNode } from "react";

type DualColumnLayoutProps = {
	single?: boolean;
	items: ReactNode[];
};
export const DualColumnLayout: FC<
	DualColumnLayoutProps
> = (props) => {
	const { items, single } = props;
	if (single) {
		return <Stack spacing={2}>{items}</Stack>;
	}
	const leftItems = items.filter(
		(_, i) => i % 2 === 0,
	);
	const rightItems = items.filter(
		(_, i) => i % 2 === 1,
	);
	return (
		<Grid
			container
			spacing={2}
		>
			<Grid
				item
				xs={6}
			>
				<Stack spacing={2}>{leftItems}</Stack>
			</Grid>
			<Grid
				item
				xs={6}
			>
				<Stack spacing={2}>{rightItems}</Stack>
			</Grid>
		</Grid>
	);
};
