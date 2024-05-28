import {
	Divider,
	Paper,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { Markdown } from "./Markdown";

type StyledCardProps = {
	href: string;
	title: string;
	metadata: string;
	content: string;
};
export const StyledCard: FC<StyledCardProps> = (
	props,
) => {
	const { content, metadata, title, href } =
		props;
	return (
		<Paper
			square
			variant="outlined"
			sx={{
				padding: 2,
			}}
		>
			<Typography
				href={href}
				fontWeight="bold"
				fontSize="x-large"
				component="a"
			>
				{title}
			</Typography>
			<Markdown markdownContent={content} />
			<Divider
				flexItem
				variant="middle"
			>
				Metadata
			</Divider>
			<Typography whiteSpace="pre-line">
				{metadata}
			</Typography>
		</Paper>
	);
};
