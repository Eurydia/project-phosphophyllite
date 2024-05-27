import { Container } from "@mui/material";
import { Buffer } from "buffer";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { Markdown } from "~components/Markdown";
import { RepoDetailsNavView } from "~views/RepoDetailsNavView";
import { LoaderData } from "./loader";

export const RepoDetailsPage: FC = () => {
	const { repo } = useLoaderData() as LoaderData;

	let decodedReadme: string | undefined;
	if (repo.readme !== undefined) {
		decodedReadme = Buffer.from(
			repo.readme,
			"base64",
		).toString();
	}

	return (
		<RepoDetailsNavView tab={0}>
			<Container maxWidth="sm">
				<Markdown
					markdownContent={decodedReadme}
					emptyText="This repository does not contain a readme."
				/>
			</Container>
		</RepoDetailsNavView>
	);
};
