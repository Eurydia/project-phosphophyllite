import {
	Card,
	CardContent,
	Divider,
	Stack,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import { Buffer } from "buffer";
import { FC, ReactNode } from "react";
import { useLoaderData } from "react-router";
import { useSubmit } from "react-router-dom";
import { Markdown } from "~components/Markdown";
import { RepoMetadatDetails } from "~components/RepoMetadataDetails";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { WithAppBar } from "~views/WithAppBar";
import { Layout } from "./Layout";
import { LoaderData } from "./loader";

export const RepoDetails: FC = () => {
	const loaderData =
		useLoaderData() as LoaderData;

	const submit = useSubmit();

	let content: ReactNode | undefined;
	if (loaderData.tab === "index") {
		let decodedReadme: string | undefined;
		if (loaderData.repo.readme !== undefined) {
			decodedReadme = Buffer.from(
				loaderData.repo.readme,
				"base64",
			).toString();
		}
		content = (
			<Stack
				spacing={2}
				divider={
					<Divider
						flexItem
						variant="middle"
					/>
				}
			>
				<Markdown
					emptyText="..."
					markdownContent={decodedReadme}
				/>
				<RepoMetadatDetails
					repo={loaderData.repo}
				/>
			</Stack>
		);
	}
	if (loaderData.tab === "issues") {
		content = (
			<Stack spacing={2}>
				{loaderData.issues.map(
					({ title, id, state, html_url }) => (
						<Card
							key={`issue-${id}`}
							variant="outlined"
						>
							<CardContent>
								<Typography>{title}</Typography>
								<Typography>{state}</Typography>
								<Typography
									href={html_url}
									component="a"
									target="_blank"
								>
									{html_url}
								</Typography>
							</CardContent>
						</Card>
					),
				)}
			</Stack>
		);
	}

	return (
		<WithAppBar
			location={<StyledBreadcrumbs />}
			seconadaryAction={
				<Tabs
					value={loaderData.tab}
					onChange={(_, tab) =>
						submit(
							{ tab },
							{ action: "./", method: "get" },
						)
					}
				>
					<Tab
						value="index"
						label="Index"
					/>
					<Tab
						value="issues"
						label="Issues"
					/>
				</Tabs>
			}
		>
			<Layout>{content}</Layout>
		</WithAppBar>
	);
};
