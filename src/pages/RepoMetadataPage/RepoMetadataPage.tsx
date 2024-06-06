import {
	Container,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router";
import {
	decodeBase64,
	repoToMetadata,
} from "~core/text";
import { LoaderData } from "./loader";

export const RepoMetadataPage: FC = () => {
	const { repo } = useLoaderData() as LoaderData;

	let decodedReadme: string | undefined;
	if (repo.readme !== undefined) {
		decodedReadme = decodeBase64(repo.readme);
	}
	const metadata = repoToMetadata(repo);

	return (
		<Container maxWidth="sm">
			<Typography>Metadata</Typography>
			<Typography whiteSpace="pre-line">
				{metadata}
			</Typography>
		</Container>
	);
};
