import { Typography } from "@mui/material";
import { invoke } from "@tauri-apps/api";
import { FC, ReactNode, useRef } from "react";
import { normalizeDateString } from "~core/time";
import { Repository } from "~types/schema";
import { StyledGrid } from "./StyledGrid";

type RepoDetailsProps = {
	repo: Repository;
};
export const RepoDetails: FC<RepoDetailsProps> = (
	props,
) => {
	const { repo } = props;
	const {
		id,
		fullName,
		htmlUrl,
		name,
		createdAt,
		description,
		pushedAt,
		updatedAt,
		status,
		visibility,
	} = repo;

	const normCreated = normalizeDateString(
		createdAt,
		"Unknown",
	);
	const normUpdated = normalizeDateString(
		updatedAt,
		"Never",
	);
	const normPushed = normalizeDateString(
		pushedAt,
		"Never",
	);
	const desc =
		description ??
		"This repository does not have a description.";
	const link = (
		<Typography
			component="a"
			onClick={() => {
				invoke("open_url", { url: htmlUrl });
			}}
		>
			{htmlUrl}
		</Typography>
	);
	const { current: headers } = useRef([
		"ID",
		"Name",
		"Full name",
		"Description",
		"Status",
		"Visibility",
		"Created",
		"Last updated",
		"Last pushed",
		"URL",
	]);
	const { current: items } = useRef<ReactNode[]>([
		id,
		name,
		fullName,
		desc,
		status,
		visibility,
		normCreated,
		normUpdated,
		normPushed,
		link,
	]);

	return (
		<StyledGrid
			items={items}
			headers={headers}
		/>
	);
};
