import {
	Typography,
	capitalize,
} from "@mui/material";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { normalizeDateString } from "~core/time";
import { ColumnHeader } from "~types/generic";
import { IssueSchema } from "~types/schema";

export const useIssueColumnHeaders = () => {
	const columns = useRef<
		ColumnHeader<IssueSchema>[]
	>([
		{
			id: "title",
			label: "Title",
			render: (issue) => {
				const target = `/Repositories/${issue.repo_full_name}/Issues/${issue.issue_number}`;
				return (
					<Typography
						component={Link}
						to={target}
					>
						{issue.title}
					</Typography>
				);
			},
		},
		{
			id: "repo_full_name",
			label: "Repository",
			render: (issue) => {
				const target = `/Repositories/${issue.repo_full_name}`;
				return (
					<Typography
						component={Link}
						to={target}
					>
						{issue.repo_full_name}
					</Typography>
				);
			},
		},
		{
			id: "issue_number",
			label: "Issue number",
			render: (issue) => issue.issue_number,
		},
		{
			id: "owner_type",
			label: "Type",
			render: (issue) => issue.owner_type,
		},
		{
			id: "state",
			label: "State",
			render: (issue) => capitalize(issue.state),
		},
		{
			id: "updated_at",
			label: "Last updated",
			render: (issue) =>
				normalizeDateString(
					issue.updated_at,
					"Never",
				),
		},
		{
			id: "created_at",
			label: "Created",
			render: (issue) =>
				normalizeDateString(
					issue.created_at,
					"Unknown",
				),
		},
	]);
	return columns.current;
};
