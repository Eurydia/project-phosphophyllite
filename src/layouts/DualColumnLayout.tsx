import { Stack } from "@mui/material";
import { FC, ReactNode } from "react";

type FlexColumnLayoutProps = {
	single?: boolean;
	items: ReactNode[];
};
export const FlexColumnLayout: FC<
	FlexColumnLayoutProps
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
		<Stack
			spacing={2}
			direction="row"
		>
			<Stack
				spacing={2}
				flexGrow={1}
				flexBasis={0}
			>
				{leftItems}
			</Stack>
			<Stack
				spacing={2}
				flexGrow={1}
				flexBasis={0}
			>
				{rightItems}
			</Stack>
		</Stack>
	);
};
