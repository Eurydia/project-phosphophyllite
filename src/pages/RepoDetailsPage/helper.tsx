import { Typography } from "@mui/material";
import { Fragment, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { toSearchParam } from "~core/query";
import { toTimeStamp } from "~core/time";
import { RepoSchema } from "~types/schemas";

export const toDetails = (repo: RepoSchema) => {
	const links = (
		<Fragment>
			<Typography
				component="a"
				href={repo.html_url}
				target="_blank"
				paddingRight={1}
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
		</Fragment>
	);
	const topics =
		repo.topics && repo.topics.length > 0
			? repo.topics.map((topic, index) => (
					<Typography
						key={`${topic}-${index}`}
						paddingRight={1}
						component={RouterLink}
						to={{
							pathname: "/",
							search: toSearchParam({
								topics: topic,
							}),
						}}
					>
						{topic}
					</Typography>
			  ))
			: "No topic assigned";
	const desc =
		repo.description ?? "No description";
	const createAt = repo.created_at
		? toTimeStamp(repo.created_at)
		: "Unknown";
	const modifiedAt = repo.updated_at
		? toTimeStamp(repo.updated_at)
		: "Unknown";
	const pushedAt = repo.pushed_at
		? toTimeStamp(repo.pushed_at)
		: "Unknown";
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
		["Links", links],
		["Last pushed", pushedAt],
		["Last modified", modifiedAt],
		["Created", createAt],
		["Visibility", visibility],
		["Status", status],
		["Topics", topics],
	];
	return detailsItems;
};
