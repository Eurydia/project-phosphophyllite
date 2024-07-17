import { Stack, Typography } from "@mui/material";
import { FC, ReactNode } from "react";

type TerminalStyleListProps = {
	items: {
		label: string;
		value: ReactNode;
	}[];
};
export const TerminalStyleList: FC<
	TerminalStyleListProps
> = (props) => {
	const { items } = props;

	if (items.length === 0) {
		return (
			<Typography>Nothing to display</Typography>
		);
	}

	const longestLabelLength = Math.max(
		...items.map(({ label }) => label.length),
	);

	const renderedRows = items.map(
		({ label, value }, index) => {
			const paddedLabel = label.padEnd(
				longestLabelLength + 3,
				".",
			);
			return (
				<Stack
					key={`${label}-${index}`}
					direction="row"
				>
					<Typography>{paddedLabel}</Typography>
					<Typography>{value}</Typography>
				</Stack>
			);
		},
	);
	return <Stack>{renderedRows}</Stack>;
};
