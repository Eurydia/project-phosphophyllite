import { SyncRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { Buffer } from "buffer";
import { useSnackbar } from "notistack";
import { FC } from "react";
import { useLoaderData } from "react-router";
import { useSubmit } from "react-router-dom";
import { Markdown } from "~components/Markdown";
import { StyledBreadcrumbs } from "~components/StyledBreadcrumbs";
import { TopicChips } from "~components/TopicChips";
import { WithAppBar } from "~views/WithAppBar";
import { Layout } from "./Layout";
import { LoaderData } from "./loader";

export const ProjectInfo: FC = () => {
	const { repo } = useLoaderData() as LoaderData;

	const submit = useSubmit();
	const { enqueueSnackbar } = useSnackbar();

	let decodedReadme: string | undefined;
	if (repo.readme !== undefined) {
		decodedReadme = Buffer.from(
			repo.readme,
			"base64",
		).toString("utf-8");
	}

	return (
		<WithAppBar
			location={<StyledBreadcrumbs />}
			seconadaryAction={
				<Button
					disableElevation
					size="small"
					variant="outlined"
					startIcon={<SyncRounded />}
					// onClick={handleSync}
				>
					Sync
				</Button>
			}
		>
			<Layout>
				<TopicChips topics={repo.topics} />
				<Markdown
					emptyText="Nothing to see here."
					content={decodedReadme}
				/>
			</Layout>
		</WithAppBar>
	);
};
