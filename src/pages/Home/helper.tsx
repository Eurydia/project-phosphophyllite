import {
	CheckRounded,
	OpenInNewRounded,
} from "@mui/icons-material";
import {
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	MenuItem,
	MenuList,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { ProjectSchema } from "~types/schemas";

type SortRulesMenuProps = {
	sortRule: string | null;
	sortRules: { label: string; value: string }[];
	onChange: (sortRule: string) => void;
};
export const SortRuleMenu: FC<
	SortRulesMenuProps
> = (props) => {
	const { sortRules, sortRule, onChange } = props;
	return (
		<MenuList>
			{sortRules.map(
				({ label, value }, index) => (
					<MenuItem
						key={value}
						value={value}
						onClick={() => onChange(value)}
					>
						<ListItemIcon>
							{value === sortRule && (
								<CheckRounded />
							)}
							{(sortRule === null ||
								sortRule.length === 0) &&
								index === 0 && <CheckRounded />}
						</ListItemIcon>
						<ListItemText>{label}</ListItemText>
					</MenuItem>
				),
			)}
		</MenuList>
	);
};

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
