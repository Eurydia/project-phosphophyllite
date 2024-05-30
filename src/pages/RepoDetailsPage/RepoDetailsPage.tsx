import {
	Container,
	Divider,
	Typography,
} from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { Markdown } from "~components/Markdown";
import {
	decodeBase64,
	repoToMetadata,
} from "~core/text";
import { RepoDetailsNavView } from "~views/RepoDetailsNavView";
import { LoaderData } from "./loader";

export const RepoDetailsPage: FC = () => {
	const { repo } = useLoaderData() as LoaderData;

	let decodedReadme: string | undefined;
	if (repo.readme !== undefined) {
		decodedReadme = decodeBase64(repo.readme);
	}
	const metadata = repoToMetadata(repo);

	return (
		<RepoDetailsNavView tab={0}>
			<Container maxWidth="sm">
				<Markdown
					markdownContent={decodedReadme}
					emptyText="This repository does not contain a readme."
				/>
				<Divider
					flexItem
					variant="middle"
				>
					Metadata
				</Divider>
				<Typography whiteSpace="pre-line">
					{metadata}
				</Typography>
			</Container>
		</RepoDetailsNavView>
	);
};
