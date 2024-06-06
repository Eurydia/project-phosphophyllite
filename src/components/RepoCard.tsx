import {
	Card,
	CardActionArea,
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
	const { fullName, description } = repo;

	const submit = useSubmit();
	const openRepo = () => {
		submit(
			{},
			{
				action: `./${fullName}`,
			},
		);
	};
	let desc = description ?? "...";
	return (
		<Card
			square
			variant="outlined"
		>
			<CardActionArea
				disableTouchRipple
				onClick={openRepo}
			>
				<CardHeader
					disableTypography
					title={
						<Typography
							fontWeight="bold"
							fontSize="x-large"
							color="primary"
						>
							{fullName}
						</Typography>
					}
				/>
				<CardContent>
					<Typography>{desc}</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};
