import {
	Breadcrumbs,
	Typography,
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

	const paths = path.normalize().split("/");
	const _paths = paths.filter(
		(path) => path.trim().length > 0,
	);
	const items = _paths.map((path, index) => {
		const target =
			"/" + paths.slice(1, index + 1).join("/");
		return (
			<Typography
				key={target}
				to={target}
				children={path}
				component={Link}
				sx={{
					whiteSpace: "nowrap",
					textDecoration: "none",
				}}
			/>
		);
	});
	return <Breadcrumbs>{items}</Breadcrumbs>;
};
