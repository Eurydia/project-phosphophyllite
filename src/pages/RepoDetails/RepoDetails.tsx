import {
	Card,
	CardContent,
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
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { WithAppBar } from "~views/WithAppBar";
import { Layout } from "./Layout";
import { LoaderData } from "./loader";

export const ProjectInfo: FC = () => {
	const loaderData =
		useLoaderData() as LoaderData;

	const submit = useSubmit();

	let content: ReactNode | undefined;
	if (loaderData.tab === "readme") {
		let decodedReadme: string | undefined;
		if (loaderData.readme !== undefined) {
			decodedReadme = Buffer.from(
				loaderData.readme,
				"base64",
			).toString();
		}
		content = (
			<Markdown
				emptyText="Nothing to see here."
				markdownContent={decodedReadme}
			/>
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

	if (loaderData.tab === "metadata") {
		const {
			description,
			homepage,
			html_url,
			// is_archived,
			// is_private,
			// created_at,
			// pushed_at,
			// updated_at,
		} = loaderData;

		content = (
			<Stack spacing={1}>
				<Typography fontWeight="bold">
					Description
				</Typography>
				<Typography paragraph>
					{description ?? "..."}
				</Typography>
				<Typography fontWeight="bold">
					Homepage
				</Typography>
				<Typography
					paragraph
					component="a"
					href={homepage ?? "#"}
					target="_blank"
				>
					{homepage ?? "..."}
				</Typography>
				<Typography fontWeight="bold">
					URL
				</Typography>
				<Typography
					paragraph
					component="a"
					href={html_url}
					target="_blank"
				>
					{html_url}
				</Typography>
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
			<Layout>{content}</Layout>
		</WithAppBar>
	);
};
