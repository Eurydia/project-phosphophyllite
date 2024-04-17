import {
	Breadcrumbs,
	BreadcrumbsProps,
	Typography,
	TypographyProps,
} from "@mui/material";
import { FC } from "react";
import { Link } from "react-router-dom";

type StyledBreadcrumbs = {
	path: string;
	breadcrumbsProps?: BreadcrumbsProps;
	typographyProps?: Omit<TypographyProps, "ref">;
};
export const StyledBreadcrumbs: FC<
	StyledBreadcrumbs
> = (props) => {
	const {
		path: path,
		breadcrumbsProps,
		typographyProps,
	} = props;

	const paths = path.normalize().split("/");
	const _paths = paths
		.filter((path) => path.trim().length > 0)
		.map((path, index) => (
			<Typography
				{...typographyProps}
				key={`${index}-${path}`}
				color="text.secondary"
				whiteSpace="nowrap"
				component={Link}
				to={
					"/" +
					paths.slice(1, index + 1).join("/")
				}
				sx={{
					textDecoration: "none",
				}}
			>
				{path}
			</Typography>
		));

	return (
		<Breadcrumbs {...breadcrumbsProps}>
			{_paths}
		</Breadcrumbs>
	);
};
