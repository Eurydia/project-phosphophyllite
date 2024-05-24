import {
	Breadcrumbs,
	Typography,
	useTheme,
} from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";

type StyledBreadcrumbs = {
	path: string;
};
export const StyledBreadcrumbs: FC<
	StyledBreadcrumbs
> = (props) => {
	const { path } = props;
	const { palette } = useTheme();

	const paths = path.normalize().split("/");
	const _paths = paths
		.filter((path) => path.trim().length > 0)
		.map((path, index) => {
			const targetPath =
				"/" + paths.slice(1, index + 1).join("/");
			return (
				<Typography
					key={targetPath}
					component={Link}
					to={targetPath}
					sx={{
						textDecoration: "none",
						whiteSpace: "nowrap",
						color: palette.text.secondary,
					}}
				>
					{path}
				</Typography>
			);
		});

	return <Breadcrumbs>{_paths}</Breadcrumbs>;
};
