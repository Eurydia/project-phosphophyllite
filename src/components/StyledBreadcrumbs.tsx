import {
	Breadcrumbs,
	BreadcrumbsProps,
	Typography,
	TypographyProps,
} from "@mui/material";
import { FC } from "react";

type StyledBreadcrumbs = {
	paths: string;
	breadcrumbsProps?: BreadcrumbsProps;
	typographyProps?: Omit<TypographyProps, "ref">;
};
export const StyledBreadcrumbs: FC<
	StyledBreadcrumbs
> = (props) => {
	const {
		paths,
		breadcrumbsProps,
		typographyProps,
	} = props;

	const paths_ = paths.split("/");

	return (
		<Breadcrumbs {...breadcrumbsProps}>
			{paths_.map((path, index) => (
				<Typography
					{...typographyProps}
					key={`${index}-${path}`}
					whiteSpace="nowrap"
				>
					{path}
				</Typography>
			))}
		</Breadcrumbs>
	);
};
