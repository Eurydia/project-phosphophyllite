import {
	Breadcrumbs,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";

type CrumbProps = {
	label: string;
	path: string;
};
const Crumb: FC<CrumbProps> = (props) => {
	const { label, path } = props;
	return (
		<Typography
			to={path}
			component={Link}
			whiteSpace="nowrap"
		>
			{label}
		</Typography>
	);
};

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
	const crumbs = _paths.map((path, index) => {
		const targetPath =
			"/" + paths.slice(1, index + 1).join("/");
		return (
			<Crumb
				key={targetPath}
				path={targetPath}
				label={path}
			/>
		);
	});
	return <Breadcrumbs>{crumbs}</Breadcrumbs>;
};
