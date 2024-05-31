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
			render: ({
				repoFullName,
				issueNumber,
				title,
			}) => {
				const target = `/Repositories/${repoFullName}/Issues/${issueNumber}`;
				return (
					<Typography
						component={Link}
						to={target}
					>
						{title}
					</Typography>
				);
			},
		},
		{
			id: "repoFullName",
			label: "Repository",
			render: ({ repoFullName }) => {
				const target = `/Repositories/${repoFullName}`;
				return (
					<Typography
						component={Link}
						to={target}
					>
						{repoFullName}
					</Typography>
				);
			},
		},
		{
			id: "issueNumber",
			label: "Issue number",
			render: ({ issueNumber }) => issueNumber,
		},
		{
			id: "ownerType",
			label: "Type",
			render: ({ ownerType }) => ownerType,
		},
		{
			id: "state",
			label: "State",
			render: ({ state }) => capitalize(state),
		},
		{
			id: "updatedAt",
			label: "Last updated",
			render: ({ updatedAt }) =>
				normalizeDateString(updatedAt, "Never"),
		},
		{
			id: "createdAt",
			label: "Created",
			render: ({ createdAt }) =>
				normalizeDateString(createdAt, "Unknown"),
		},
	]);
	return columns.current;
};
