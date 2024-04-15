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
					textOverflow="ellipsis"
					whiteSpace="nowrap"
					overflow="hidden"
					width="100%"
					key={`${index}-${path}`}
				>
					{path}
				</Typography>
			))}
		</Breadcrumbs>
	);
};
