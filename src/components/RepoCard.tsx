import {
	EditRounded,
	ExpandLessRounded,
	ExpandMoreRounded,
	Inventory2Rounded,
	LaunchRounded,
	PersonRounded,
	PublicRounded,
} from "@mui/icons-material";
import {
	Button,
	Card,
	CardContent,
	Collapse,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { useSubmit } from "react-router-dom";
import { toISOtoLocaleDateString } from "~core/index";
import { RepoSchema } from "~types/schemas";
import { TopicChips } from "./TopicChips";

type RepoCardProps = { repo: RepoSchema };
export const RepoCard: FC<RepoCardProps> = (
	props,
) => {
	const { repo } = props;
	const submit = useSubmit();
	const [isExpanded, setIsExpanded] =
		useState(false);

	const handleRedirect = () => {
		submit(
			{},
			{
				action: `/${repo.full_name}`,
				method: "get",
			},
		);
	};

	const owner = repo.full_name.split("/")[0];

	return (
		<Card>
			<CardContent>
				<Grid
					container
					spacing={1}
				>
					<Grid
						item
						xs={10}
					>
						<Typography
							whiteSpace="nowrap"
							overflow="hidden"
							textOverflow="ellipsis"
							fontSize="larger"
							fontWeight="bold"
						>
							{repo.name}
						</Typography>
					</Grid>
					<Grid
						item
						xs={1}
					>
						{repo.is_archived ? (
							<Inventory2Rounded titleAccess="Archived" />
						) : (
							<EditRounded titleAccess="Unarchived" />
						)}
					</Grid>
					<Grid
						item
						xs={1}
					>
						{repo.is_private ? (
							<PersonRounded titleAccess="Private" />
						) : (
							<PublicRounded titleAccess="Public" />
						)}
					</Grid>
					<Grid
						item
						xs={12}
					>
						<Typography
							whiteSpace="nowrap"
							overflow="hidden"
							textOverflow="ellipsis"
						>
							{owner}
						</Typography>
					</Grid>
					{repo.description && (
						<Grid
							item
							xs={12}
						>
							<Typography
								whiteSpace="nowrap"
								overflow="hidden"
								textOverflow="ellipsis"
							>
								{repo.description}
							</Typography>
						</Grid>
					)}
					<Grid
						item
						xs={2}
					>
						<Button
							disableElevation
							disableRipple
							onClick={handleRedirect}
							startIcon={<LaunchRounded />}
							variant="outlined"
						>
							Open
						</Button>
					</Grid>
					<Grid
						item
						xs
					></Grid>
					<Grid
						item
						xs={1}
					>
						<IconButton
							edge="start"
							size="small"
							onClick={() =>
								setIsExpanded(!isExpanded)
							}
						>
							{isExpanded ? (
								<ExpandLessRounded />
							) : (
								<ExpandMoreRounded />
							)}
						</IconButton>
					</Grid>
				</Grid>
			</CardContent>
			<Collapse in={isExpanded}>
				<CardContent
					sx={{
						paddingTop: 0,
						overflow: "auto",
					}}
				>
					<List
						dense
						disablePadding
					>
						<ListItem disableGutters>
							<ListItemText
								primary={toISOtoLocaleDateString(
									repo.created_at,
								)}
								secondary="Created"
							/>
						</ListItem>
						<ListItem disableGutters>
							<ListItemText
								primary={toISOtoLocaleDateString(
									repo.updated_at,
								)}
								secondary="Updated"
							/>
						</ListItem>
						<ListItem disableGutters>
							<ListItemText
								primary={toISOtoLocaleDateString(
									repo.pushed_at,
								)}
								secondary="Pushed"
							/>
						</ListItem>
					</List>
					<TopicChips topics={repo.topics} />
				</CardContent>
			</Collapse>
		</Card>
	);
};
