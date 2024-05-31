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
			id: "full_name",
			label: "Name",
			render: (repo) => {
				const target = `/Repositories/${repo.fullName}`;
				return (
					<Typography
						component={Link}
						to={target}
					>
						{repo.fullName}
					</Typography>
				);
			},
		},
		{
			id: "is_archived",
			label: "Status",
			render: (repo) =>
				repo.status ? "Archived" : "Active",
		},
		{
			id: "is_private",
			label: "Visibility",
			render: (repo) =>
				repo.visibility ? "Private" : "Public",
		},
		{
			id: "pushed_at",
			label: "Last pushed",
			render: (repo) =>
				normalizeDateString(
					repo.pushedAt,
					"Never",
				),
		},
		{
			id: "updated_at",
			label: "Last updated",
			render: (repo) =>
				normalizeDateString(
					repo.updatedAt,
					"Never",
				),
		},
		{
			id: "created_at",
			label: "Created",
			render: (repo) =>
				normalizeDateString(
					repo.createdAt,
					"Unknown",
				),
		},
	]);
	return columns.current;
};
