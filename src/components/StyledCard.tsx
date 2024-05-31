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
	const { content, metadata, title } = props;

	return (
		<Paper
			square
			variant="outlined"
			sx={{
				padding: 2,
			}}
		>
			<Typography
				fontWeight="bold"
				fontSize="x-large"
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
