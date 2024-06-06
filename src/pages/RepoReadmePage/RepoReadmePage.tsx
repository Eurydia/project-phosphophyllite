import { Container } from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { Markdown } from "~components/Markdown";
import { decodeBase64 } from "~core/text";
import { LoaderData } from "./loader";

export const RepoReadmePage: FC = () => {
	const { repo } = useLoaderData() as LoaderData;

	let decodedReadme: string | undefined;
	if (repo.readme !== undefined) {
		decodedReadme = decodeBase64(repo.readme);
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
