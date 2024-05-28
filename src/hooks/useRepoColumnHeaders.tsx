import { Typography } from "@mui/material";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { normalizeDateString } from "~core/time";
import { ColumnHeader } from "~types/generics";
import { RepoSchema } from "~types/schemas";

export const useRepoColumnHeaders = () => {
	const columns = useRef<
		ColumnHeader<RepoSchema>[]
	>([
		{
			id: "full_name",
			label: "Name",
			render: (repo) => {
				const target = `/Repositories/${repo.full_name}`;
				return (
					<Typography
						component={Link}
						to={target}
					>
						{repo.full_name}
					</Typography>
				);
			},
		},
		{
			id: "is_archived",
			label: "Status",
			render: (repo) =>
				repo.is_archived ? "Archived" : "Active",
		},
		{
			id: "is_private",
			label: "Visibility",
			render: (repo) =>
				repo.is_private ? "Private" : "Public",
		},
		{
			id: "pushed_at",
			label: "Last pushed",
			render: (repo) =>
				normalizeDateString(
					repo.pushed_at,
					"Never",
				),
		},
		{
			id: "updated_at",
			label: "Last updated",
			render: (repo) =>
				normalizeDateString(
					repo.updated_at,
					"Never",
				),
		},
		{
			id: "created_at",
			label: "Created",
			render: (repo) =>
				normalizeDateString(
					repo.created_at,
					"Unknown",
				),
		},
	]);
	return columns.current;
};
