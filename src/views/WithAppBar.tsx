import {
	Grid,
	IconButton,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import { FC, Fragment, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { IconHexagonMultiple } from "~assets/HexagonGroup";

type WithAppBarProps = {
	location: ReactNode;
	children: ReactNode;
	seconadaryNav?: ReactNode;
};
export const WithAppBar: FC<WithAppBarProps> = (
	props,
) => {
	const { location, children, seconadaryNav } =
		props;

	return (
		<Fragment>
			<Paper
				square
				variant="outlined"
				sx={{
					width: "100%",
					paddingY: 1,
					paddingX: 2,
				}}
			>
				<Grid
					container
					spacing={1}
					alignItems="center"
				>
					<Grid
						item
						xs={1}
						display="flex"
						justifyContent="center"
					>
						<IconButton
							disableRipple
							title="Home"
							component={RouterLink}
							to="/"
						>
							<IconHexagonMultiple />
						</IconButton>
					</Grid>
					<Grid
						item
						xs={5}
					>
						<Typography
							variant="subtitle1"
							width="100%"
							overflow="hidden"
							whiteSpace="nowrap"
							textOverflow="ellipsis"
						>
							{location}
						</Typography>
					</Grid>
					<Grid
						item
						xs={6}
					>
						<Stack
							spacing={2}
							justifyContent="end"
							direction="row"
						>
							{seconadaryNav}
						</Stack>
					</Grid>
				</Grid>
			</Paper>
			{children}
		</Fragment>
	);
};
