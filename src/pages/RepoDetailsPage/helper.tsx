import { Stack, Typography } from "@mui/material";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { toSearchParam } from "~core/query";
import { toTimeStamp } from "~core/time";
import { RepoSchema } from "~types/schemas";

export const toDetails = (repo: RepoSchema) => {
	const links = (
		<Stack
			component="span"
			flexDirection="row"
			flexWrap="wrap"
			gap={1}
		>
			<Typography
				component="a"
				href={repo.html_url}
				target="_blank"
			>
				GitHub repository
			</Typography>
			<Typography
				component="a"
				href={repo.homepage ?? undefined}
				target="_blank"
			>
				Homepage
			</Typography>
		</Stack>
	);
	const topics =
		repo.topics && repo.topics.length > 0 ? (
			<Stack
				gap={1}
				flexDirection="row"
				flexWrap="wrap"
			>
				{repo.topics.map((topic) => (
					<Typography
						key={topic}
						component={Link}
						to={{
							pathname: "/repositories",
							search: toSearchParam({
								topics: topic,
							}),
						}}
					>
						{topic}
					</Typography>
				))}
			</Stack>
		) : (
			"No topic assigned"
		);
	const desc =
		repo.description ?? "No description";
	const createAt = repo.created_at
		? toTimeStamp(repo.created_at)
		: "Unknown";
	const modifiedAt = repo.updated_at
		? toTimeStamp(repo.updated_at)
		: "Never";
	const pushedAt = repo.pushed_at
		? toTimeStamp(repo.pushed_at)
		: "Never";
	const visibility = repo.is_private
		? "Private"
		: "Public";
	const status = repo.is_archived
		? "Archived"
		: "Active";

	const detailsItems: [
		label: string,
		value: ReactNode,
	][] = [
		["Description", desc],
		["Last pushed", pushedAt],
		["Last modified", modifiedAt],
		["Created", createAt],
		["Visibility", visibility],
		["Status", status],
		["Links", links],
		["Topics", topics],
	];
	return detailsItems;
};
