import { Grid, Typography } from "@mui/material";
import { FC, Fragment, ReactNode } from "react";

type StyledGridProps = {
	headers: ReactNode[];
	items: ReactNode[];
};
export const StyledGrid: FC<StyledGridProps> = (
	props,
) => {
	const { headers, items } = props;
	const renderedRows = headers.map(
		(header, index) => {
			return (
				<Fragment key={`r${index}`}>
					<Grid
						item
						xs={4}
					>
						<Typography>{header}:</Typography>
					</Grid>
					<Grid
						item
						xs={8}
						sx={{
							wordBreak: "break-all",
						}}
					>
						{items[index]}
					</Grid>
				</Fragment>
			);
		},
	);
	return (
		<Grid
			container
			spacing={1}
			width="100%"
		>
			{renderedRows}
		</Grid>
	);
};
