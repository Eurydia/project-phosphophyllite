import { Container } from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { Markdown } from "~components/Markdown";
import { decodeBase64 } from "~core/encoding";
import { LoaderData } from "./loader";

export const RepoReadmePage: FC = () => {
	const { repository } =
		useLoaderData() as LoaderData;

	let decodedReadme: string | undefined;
	if (repository.readme !== undefined) {
		decodedReadme = decodeBase64(
			repository.readme,
		);
	}

	return (
		<Container maxWidth="sm">
			<Markdown
				markdownContent={decodedReadme}
				emptyText="This repository does not contain a readme."
			/>
		</Container>
	);
};
