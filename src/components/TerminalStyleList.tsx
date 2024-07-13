import { Grid, Typography } from "@mui/material";
import { FC, Fragment } from "react";

type TerminalStyleListProps = {
	items: {
		label: string;
		value: string;
	}[];
};
export const TerminalStyleList: FC<
	TerminalStyleListProps
> = (props) => {
	const { items } = props;

	if (items.length === 0) {
		return (
			<Typography>
				Nothing item to display
			</Typography>
		);
	}

	const renderedRows = items.map(
		({ label, value }, index) => {
			return (
				<Fragment key={`row-${index}`}>
					<Grid
						item
						xs={3}
					>
						<Typography>{label}</Typography>
					</Grid>
					<Grid
						item
						xs={1}
					>
						<Typography>:</Typography>
					</Grid>
					<Grid
						item
						xs={8}
					>
						<Typography>{value}</Typography>
					</Grid>
				</Fragment>
			);
		},
	);
	return <Grid container>{renderedRows}</Grid>;
};
