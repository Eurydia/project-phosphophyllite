import {
	List,
	ListItem,
	ListItemText,
	ListSubheader,
	Typography,
} from "@mui/material";
import { FC, Fragment } from "react";
import { Link as RouterLink } from "react-router-dom";
import { toSearchParam } from "~core/query";
import { toTimeStamp } from "~core/time";
import { RepoSchema } from "~types/schemas";

type RepoMetadatDetailsProps = {
	repo: RepoSchema;
};
export const RepoMetadatDetails: FC<
	RepoMetadatDetailsProps
> = (props) => {
	const { repo } = props;

	const desc = (
		<Fragment>
			<b>Description</b>: {repo.description}
		</Fragment>
	);
	const createAt = repo.created_at ? (
		<Fragment>
			<b>Created at</b>:{" "}
			{toTimeStamp(repo.created_at)}
		</Fragment>
	) : (
		""
	);
	const updateAt = repo.updated_at ? (
		<Fragment>
			<b>Updated at</b>:{" "}
			{toTimeStamp(repo.updated_at)}
		</Fragment>
	) : (
		""
	);
	const pushedAt = repo.pushed_at ? (
		<Fragment>
			<b>Pushed at</b>:{" "}
			{toTimeStamp(repo.pushed_at)}
		</Fragment>
	) : (
		""
	);
	return (
		<List>
			<ListSubheader
				disableGutters
				disableSticky
			>
				Metadata
			</ListSubheader>
			<ListItem>
				<ListItemText>
					<b>GitHub repository</b>:{" "}
					<Typography
						component="a"
						href={repo.html_url}
						target="_blank"
					>
						link
					</Typography>
				</ListItemText>
			</ListItem>
			<ListItem>
				<ListItemText>
					<b>Homepage</b>:{" "}
					<Typography
						component="a"
						href={repo.homepage ?? "#"}
						target="_blank"
					>
						link
					</Typography>
				</ListItemText>
			</ListItem>

			<ListItem>
				<ListItemText primary={desc} />
			</ListItem>
			<ListItem
				sx={{
					display: "flex",
					flexDirection: "row",
					gap: 1,
					flexWrap: "wrap",
				}}
			>
				<b>Topics</b>:{" "}
				{repo.topics
					? repo.topics.map((topic, index) => (
							<Typography
								key={`${topic}-${index}`}
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
					: "..."}
			</ListItem>
			<ListItem>
				<ListItemText primary={pushedAt} />
			</ListItem>
			<ListItem>
				<ListItemText primary={updateAt} />
			</ListItem>
			<ListItem>
				<ListItemText primary={createAt} />
			</ListItem>
		</List>
	);
};
