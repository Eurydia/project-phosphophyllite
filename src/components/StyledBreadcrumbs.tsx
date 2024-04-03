import {
	Breadcrumbs,
	BreadcrumbsProps,
	Typography,
	TypographyProps,
} from "@mui/material";
import { FC } from "react";
import { useLocation } from "react-router";

type StyledBreadcrumbs = {
	breadcrumbsProps?: BreadcrumbsProps;
	typographyProps?: Omit<TypographyProps, "ref">;
};
export const StyledBreadcrumbs: FC<
	StyledBreadcrumbs
> = (props) => {
	const { breadcrumbsProps, typographyProps } =
		props;
	const { pathname } = useLocation();
	const pathnames = pathname.split("/");

	return (
		<Breadcrumbs {...breadcrumbsProps}>
			{pathnames.map((path, index) => (
				<Typography
					{...typographyProps}
					key={`${index}-${path}`}
				>
					{path}
				</Typography>
			))}
		</Breadcrumbs>
	);
};
