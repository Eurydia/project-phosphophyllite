import {
	Container,
	Grid,
	Typography,
} from "@mui/material";
import { invoke } from "@tauri-apps/api";
import {
	FC,
	Fragment,
	ReactNode,
	useRef,
} from "react";
import { useLoaderData } from "react-router";
import { normalizeDateString } from "~core/time";
import { LoaderData } from "./loader";

export const RepoMetadataPage: FC = () => {
	const { repo } = useLoaderData() as LoaderData;
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

	const openLink = () => {
		invoke("open_url", { url: htmlUrl });
	};
	const link = (
		<Typography
			component="a"
			onClick={openLink}
			sx={{
				cursor: "pointer",
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
	const renderedRows = headers.map(
		(header, index) => {
			return (
				<Fragment key={header}>
					<Grid
						item
						xs={4}
					>
						<Typography>{header}:</Typography>
					</Grid>
					<Grid
						item
						xs={8}
					>
						{items[index]}
					</Grid>
				</Fragment>
			);
		},
	);

	return (
		<Container maxWidth="sm">
			<Grid
				padding={2}
				container
				spacing={1}
			>
				{renderedRows}
			</Grid>
		</Container>
	);
};
