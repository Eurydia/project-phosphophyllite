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
import { IssueSchema } from "~types/schema";

type IssueCardProps = {
	issue: IssueSchema;
};
export const IssueCard: FC<IssueCardProps> = (
	props,
) => {
	const { issue } = props;
	const {
		repoFullName,
		issueNumber,
		title,
		body,
	} = issue;

	const submit = useSubmit();
	const goToDetails = () => {
		const action = `/Repositories/${repoFullName}/Issues/${issueNumber}`;
		submit(
			{},
			{
				action,
			},
		);
	};
	const goToRepo = () => {
		const action = `/Repositories/${repoFullName}`;
		submit(
			{},
			{
				action,
			},
		);
	};

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
						{title}
					</Typography>
				}
				subheader={
					<Typography>{repoFullName}</Typography>
				}
			/>
			{body && (
				<CardContent>
					<Typography
						maxHeight="250px"
						overflow="hidden"
						textOverflow="ellipsis"
					>
						{body}
					</Typography>
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
					onClick={goToRepo}
				>
					Repository
				</Button>
			</CardActions>
		</Card>
	);
};
