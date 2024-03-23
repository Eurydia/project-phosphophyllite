import { OpenInNewRounded } from "@mui/icons-material";
import {
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { TicketSchema } from "~types/schemas";

type TicketListProps = {
	tickets: TicketSchema[];
};
export const TicketList: FC<TicketListProps> = (
	props,
) => {
	const { tickets } = props;

	if (tickets.length === 0) {
		return (
			<Typography
				variant="body1"
				fontStyle="italic"
			>
				No project to display.
			</Typography>
		);
	}

	return (
		<List>
			{tickets.map(
				({ title, tags, projectId }, index) => (
					<ListItem key={`project-${index}`}>
						<ListItemIcon>
							<Typography
								width="100%"
								display="flex"
								alignItems="center"
								justifyContent="cetner"
								color="secondary"
								fontSize="large"
								fontWeight="bolder"
							>
								{projectId}
							</Typography>
						</ListItemIcon>
						<ListItemText
							title={title}
							primaryTypographyProps={{
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
								width: "50%",
							}}
							secondary={tags.join(", ")}
						>
							{title}
						</ListItemText>
						<ListItemSecondaryAction>
							<IconButton
								title="Open"
								component={RouterLink}
								to={`/ticket/${projectId}`}
								color="primary"
							>
								<OpenInNewRounded />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				),
			)}
		</List>
	);
};
