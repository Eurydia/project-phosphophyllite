import {
	Paper,
	Stack,
	StackProps,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { toSearchParam } from "~core/query";

type TopicChipsProps = {
	topics?: string[];
	stackProps?: StackProps;
};
export const TopicChips: FC<TopicChipsProps> = (
	props,
) => {
	const { topics, stackProps } = props;
	if (
		topics === undefined ||
		topics.length === 0
	) {
		return;
	}

	return (
		<Stack
			{...stackProps}
			display="flex"
			flexWrap="wrap"
			flexDirection="row"
			gap={1}
		>
			{topics.map((topic) => (
				<Paper
					key={topic}
					square
					variant="outlined"
					sx={{
						padding: 1,
						borderRadius: 2,
					}}
				>
					<Typography
						component={RouterLink}
						sx={{ textDecoration: "none" }}
						color="default"
						to={{
							pathname: "/",
							search: toSearchParam({
								topics: topic,
							}),
						}}
					>
						{topic}
					</Typography>
				</Paper>
			))}
		</Stack>
	);
};
