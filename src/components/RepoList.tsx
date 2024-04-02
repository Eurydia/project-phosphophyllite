import {
	EditRounded,
	Inventory2Rounded,
	PersonRounded,
	PublicRounded,
} from "@mui/icons-material";
import {
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { useSubmit } from "react-router-dom";
import { RepositorySchema } from "~types/schemas";

type RepoListProps = {
	repos: RepositorySchema[];
};
export const RepoList: FC<RepoListProps> = (
	props,
) => {
	const { repos } = props;
	const submit = useSubmit();

	const handleRepoRedirect = (
		repoName: string,
	) => {
		submit(
			{},
			{
				action: `/repo/${repoName}`,
				method: "get",
			},
		);
	};

	if (repos.length === 0) {
		return (
			<Typography
				variant="body1"
				fontStyle="italic"
			>
				No repository found.
			</Typography>
		);
	}
	return (
		<List>
			<ListSubheader>
				Showing {repos.length} repositories
			</ListSubheader>
			{repos.map(
				({
					name,
					description,
					is_archived,
					is_private,
				}) => (
					<ListItem key={`repo-${name}`}>
						<ListItemIcon>
							{is_archived ? (
								<Inventory2Rounded />
							) : (
								<EditRounded />
							)}
							{is_private ? (
								<PersonRounded />
							) : (
								<PublicRounded />
							)}
						</ListItemIcon>
						<ListItemButton
							disableRipple
							onClick={() =>
								handleRepoRedirect(name)
							}
						>
							<ListItemText
								title={name}
								primaryTypographyProps={{
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
								secondary={description}
								secondaryTypographyProps={{
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								{name}
							</ListItemText>
						</ListItemButton>
					</ListItem>
				),
			)}
		</List>
	);
};