import { Typography } from "@mui/material";
import { FC } from "react";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { WithAppBar } from "~views/WithAppBar";

export const HomePage: FC = () => {
	return (
		<WithAppBar
			location={<StyledBreadcrumbs paths="~" />}
		>
			<Typography>
				Nothing to see here.
			</Typography>
		</WithAppBar>
	);
};
