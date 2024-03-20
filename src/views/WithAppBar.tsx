import { Link } from "react-router-dom";
import { HomeRounded } from "@mui/icons-material";
import {
	Divider,
	IconButton,
	Paper,
	Stack,
	Tooltip,
	Typography,
	Link as MUILink,
} from "@mui/material";
import { FC, ReactNode } from "react";

type WithAppBarProps = {
	location: string;
	children: ReactNode;
};
export const WithAppBar: FC<WithAppBarProps> = (
	props,
) => {
	const { location, children } = props;

	return (
		<Stack>
			<Paper
				square
				variant="outlined"
				sx={{
					padding: 1,
					width: "100%",
				}}
			>
				<Stack
					alignItems="center"
					spacing={2}
					direction="row"
					divider={
						<Divider
							flexItem
							variant="fullWidth"
							orientation="vertical"
						/>
					}
				>
					<IconButton
						component={Link}
						to="/"
					>
						<Tooltip title="Home">
							<HomeRounded />
						</Tooltip>
					</IconButton>
					<Typography>{location}</Typography>
				</Stack>
			</Paper>
			{children}
		</Stack>
	);
};
