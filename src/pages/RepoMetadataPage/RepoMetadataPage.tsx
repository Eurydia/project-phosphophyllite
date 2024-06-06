import { Box, Container } from "@mui/material";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { RepoDetails } from "~components/RepoDetails";
import { LoaderData } from "./loader";

export const RepoMetadataPage: FC = () => {
	const { repo } = useLoaderData() as LoaderData;

	return (
		<Container maxWidth="sm">
			<Box padding={2}>
				<RepoDetails repo={repo} />
			</Box>
		</Container>
	);
};
