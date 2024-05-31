import { Typography } from "@mui/material";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { normalizeDateString } from "~core/time";
import { ColumnHeader } from "~types/generic";
import { RepoSchema } from "~types/schema";

export const useRepoColumnHeaders = () => {
	const columns = useRef<
		ColumnHeader<RepoSchema>[]
	>([
		{
			id: "fullName",
			label: "Name",
			render: ({ fullName }) => {
				const target = `/Repositories/${fullName}`;
				return (
					<Typography
						component={Link}
						to={target}
					>
						{fullName}
					</Typography>
				);
			},
		},
		{
			id: "status",
			label: "Status",
			render: ({ status }) => status,
		},
		{
			id: "visibility",
			label: "Visibility",
			render: ({ visibility }) => visibility,
		},
		{
			id: "pushedAt",
			label: "Last pushed",
			render: ({ pushedAt }) =>
				normalizeDateString(pushedAt, "Never"),
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
