import {
	Card,
	CardActionArea,
	CardContent,
	CardHeader,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { useSubmit } from "react-router-dom";
import { Issue } from "~types/schema";

type IssueCardProps = {
	issue: Issue;
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
	const openIssue = () => {
		const action = `/Repositories/${repoFullName}/Issues/${issueNumber}`;
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
			<CardActionArea
				disableTouchRipple
				onClick={openIssue}
			>
				<CardHeader
					disableTypography
					title={
						<Typography
							fontWeight="bold"
							fontSize="x-large"
							color="primary"
						>
							{title}
						</Typography>
					}
					subheader={
						<Typography>
							{repoFullName}
						</Typography>
					}
				/>
				{body && (
					<CardContent>
						<Typography
							maxHeight="250px"
							overflow="hidden"
						>
							{body}
						</Typography>
					</CardContent>
				)}
			</CardActionArea>
		</Card>
	);
};
