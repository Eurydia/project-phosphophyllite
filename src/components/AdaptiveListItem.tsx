import {
	ListItem,
	ListItemText,
	Stack,
} from "@mui/material";
import { FC, ReactNode } from "react";

type AdaptiveListItemProps = {
	children: ReactNode;
	text: string;
};
export const AdaptiveListItem: FC<
	AdaptiveListItemProps
> = (props) => {
	const { text, children } = props;
	return (
		<ListItem disableGutters>
			<Stack
				width="100%"
				display="flex"
				flexDirection="row"
				flexWrap="wrap"
				alignItems="start"
				justifyContent="space-between"
			>
				<ListItemText
					sx={{
						width: "max(200px, 40%)",
					}}
				>
					{text}
				</ListItemText>
				<Stack
					alignItems="center"
					flexDirection="row"
					minWidth="max(200px, 25%)"
				>
					{children}
				</Stack>
			</Stack>
		</ListItem>
	);
};
