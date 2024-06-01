import {
	Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { useSubmit } from "react-router-dom";
import { RepoSchema } from "~types/schema";

type RepoCardProps = {
	repo: RepoSchema;
};
export const RepoCard: FC<RepoCardProps> = (
	props,
) => {
	const { repo } = props;
	const { fullName } = repo;

	const submit = useSubmit();
	const goToDetails = () => {
		submit(
			{},
			{
				action: `./${fullName}`,
			},
		);
	};
	const goToIssues = () => {
		submit(
			{},
			{
				action: `./${fullName}/Issues`,
			},
		);
	};

	const desc = repo.description;

	return (
		<Card
			square
			variant="outlined"
		>
			<CardHeader
				disableTypography
				title={
					<Typography
						fontWeight="bold"
						fontSize="x-large"
					>
						{fullName}
					</Typography>
				}
			/>
			{desc && (
				<CardContent>
					<Typography>{desc}</Typography>
				</CardContent>
			)}
			<CardActions>
				<Button
					disableTouchRipple
					disableFocusRipple
					onClick={goToDetails}
				>
					Open
				</Button>
				<Button
					disableTouchRipple
					disableFocusRipple
					onClick={goToIssues}
				>
					Issues
				</Button>
			</CardActions>
		</Card>
	);
};
