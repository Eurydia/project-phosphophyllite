import { FC, useEffect, useState } from "react";
import {
	Box,
	Button,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
	CreateNewFolderRounded,
	OpenInNewRounded,
} from "@mui/icons-material";
import {
	ProjectSchema,
	getProjectAll,
} from "@database";

export const Home: FC = () => {
	const [projects, setProjects] = useState<
		ProjectSchema[]
	>([]);

	useEffect(() => {
		const fetchProject = async () => {
			setProjects(await getProjectAll());
		};
		fetchProject();
	}, []);

	return (
		<Box padding={4}>
			<Button
				variant="contained"
				component={RouterLink}
				to="/project/create"
				startIcon={<CreateNewFolderRounded />}
			>
				NEW
			</Button>
			<List>
				{projects.map((project, index) => {
					return (
						<ListItem
							key={`${project.name}-${index}`}
						>
							<ListItemText>
								{project.name}
							</ListItemText>
							<ListItemSecondaryAction>
								<IconButton
									component={RouterLink}
									to={`project/${project.projectId}`}
								>
									<OpenInNewRounded />
								</IconButton>
							</ListItemSecondaryAction>
						</ListItem>
					);
				})}
			</List>
		</Box>
	);
};
