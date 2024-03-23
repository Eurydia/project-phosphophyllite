import { OpenInNewRounded } from "@mui/icons-material";
import {
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ProjectSchema } from "~types/schemas";

type ProjectListProps = {
	projects: ProjectSchema[];
};
export const ProjectList: FC<ProjectListProps> = (
	props,
) => {
	const { projects } = props;

	if (projects.length === 0) {
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
			{projects.map(
				({ name, tags, projectId }, index) => (
					<ListItem key={`project-${index}`}>
						<ListItemText
							inset
							title={name}
							primaryTypographyProps={{
								overflow: "hidden",
								textOverflow: "ellipsis",
								whiteSpace: "nowrap",
								width: "50%",
							}}
							secondary={tags.join(", ")}
						>
							{name}
						</ListItemText>
						<ListItemSecondaryAction>
							<IconButton
								title="Open"
								component={RouterLink}
								to={`/project/${projectId}`}
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
