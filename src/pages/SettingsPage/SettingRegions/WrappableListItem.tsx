import {
	ListItem,
	ListItemText,
	Stack,
} from "@mui/material";
import { FC, ReactNode } from "react";

type WrappableListItemProps = {
	children?: ReactNode;
	primary?: string;
	secondary?: string;
};
export const WrappableListItem: FC<
	WrappableListItemProps
> = (props) => {
	const { secondary, primary, children } = props;
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
					primary={primary}
					secondary={secondary}
					sx={{
						width: "max(200px, 40%)",
					}}
				/>
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
