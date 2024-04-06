import {
	EditRounded,
	Inventory2Rounded,
	PersonRounded,
	PublicRounded,
} from "@mui/icons-material";
import {
	Card,
	CardActionArea,
	CardContent,
	Grid,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { useSubmit } from "react-router-dom";
import { RepoSchema } from "~types/schemas";

type RepoCardProps = { repo: RepoSchema };
export const RepoCard: FC<RepoCardProps> = (
	props,
) => {
	const { repo } = props;
	const submit = useSubmit();

	const handleRedirect = () => {
		submit(
			{},
			{
				action: `/${repo.full_name}`,
				method: "get",
			},
		);
	};

	return (
		<Card variant="outlined">
			<CardActionArea onClick={handleRedirect}>
				<CardContent>
					<Grid
						container
						spacing={1}
					>
						<Grid
							item
							xs={12}
						>
							<Typography
								whiteSpace="nowrap"
								overflow="hidden"
								textOverflow="ellipsis"
								display="block"
								fontSize="large"
								maxWidth="100%"
							>
								{repo.full_name}
							</Typography>
						</Grid>
						<Grid
							item
							xs={10}
						></Grid>
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
					</Grid>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};
