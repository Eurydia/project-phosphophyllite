import {
	Divider,
	Stack,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { normalizeDateString } from "~core/time";
import { AppIssue } from "~types/models";
import { TerminalStyleList } from "./TerminalStyleList";

type IssueDetailsProps = {
	issue: AppIssue;
};
export const IssueDetails: FC<
	IssueDetailsProps
> = (props) => {
	const { issue } = props;
	const {
		body,
		closed_at,
		state,
		title,
		updated_at,
		created_at,
		user_type,
	} = issue;

	const content =
		body ??
		"This issue does not have a body or its body is not cached.";

	const listItems: {
		label: string;
		value: string;
	}[] = [
		{
			label: "Title",
			value: title,
		},
		{
			label: "State",
			value: state,
		},
		{
			label: "User type",
			value: user_type,
		},
		{
			label: "Created",
			value: normalizeDateString(
				created_at,
				"Unknown",
			),
		},
		{
			label: "Last updated",
			value: normalizeDateString(
				updated_at,
				"Unknown",
			),
		},
		{
			label: "Closed",
			value: normalizeDateString(
				closed_at,
				"Never",
			),
		},
	];

	return (
		<Stack spacing={2}>
			<TerminalStyleList items={listItems} />
			<Divider flexItem />
			<Typography whiteSpace="pre-wrap">
				{content}
			</Typography>
		</Stack>
	);
};
