import {
	Card,
	CardContent,
	Stack,
	Tab,
	Tabs,
	Typography,
} from "@mui/material";
import { Buffer } from "buffer";
import { useSnackbar } from "notistack";
import { FC, ReactNode } from "react";
import { useLoaderData } from "react-router";
import { useSubmit } from "react-router-dom";
import { Markdown } from "~components/Markdown";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { TopicChips } from "~components/TopicChips";
import { WithAppBar } from "~views/WithAppBar";
import { Layout } from "./Layout";
import { LoaderData } from "./loader";

export const ProjectInfo: FC = () => {
	const loaderData =
		useLoaderData() as LoaderData;

	const submit = useSubmit();
	const { enqueueSnackbar } = useSnackbar();

	let content: ReactNode | undefined;
	if (loaderData.tab === "readme") {
		let decodedReadme: string | undefined;
		if (loaderData.readme !== undefined) {
			decodedReadme = Buffer.from(
				loaderData.readme,
				"base64",
			).toString("utf-8");
		}
		content = (
			<Layout>
				<TopicChips topics={loaderData.topics} />
				<Markdown
					emptyText="Nothing to see here."
					markdownContent={decodedReadme}
				/>
			</Layout>
		);
	}
	if (loaderData.tab === "issues") {
		content = (
			<Layout>
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
			</Layout>
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
						value="readme"
						label="Read me"
					/>
					<Tab
						value="metadata"
						label="Metadata"
					/>
					<Tab
						value="issues"
						label="Issues"
					/>
				</Tabs>
			}
		>
			{content}
		</WithAppBar>
	);
};
