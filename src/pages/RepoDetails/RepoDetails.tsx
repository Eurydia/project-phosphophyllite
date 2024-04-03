import { SyncRounded } from "@mui/icons-material";
import {
	Button,
	Container,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { RequestError } from "octokit";
import { FC, useEffect } from "react";
import { useLoaderData } from "react-router";
import {
	Link as RouterLink,
	createSearchParams,
	useSubmit,
} from "react-router-dom";
import { parseMarkdown } from "~core/markdown";
import { getRepoContentReadMe } from "~database/api";
import { syncCachedReadme } from "~database/cached";
import { WithAppBar } from "~views/WithAppBar";
import { LoaderData } from "./loader";

export const ProjectInfo: FC = () => {
	const { repo, readmeContent } =
		useLoaderData() as LoaderData;

	const submit = useSubmit();
	const { enqueueSnackbar } = useSnackbar();

	useEffect(() => {
		const preveiwElement =
			document.getElementById("preview");
		if (!preveiwElement) {
			return;
		}
		preveiwElement.innerHTML = parseMarkdown(
			readmeContent,
		);
	}, [readmeContent]);

	const handleSyncReadme = async () => {
		getRepoContentReadMe(repo.full_name)
			.then((readme) => syncCachedReadme(readme))
			.then(() =>
				submit(
					{},
					{ action: ".", method: "get" },
				),
			)
			.then(() =>
				enqueueSnackbar(
					"Synchronization successful.",
					{
						variant: "success",
					},
				),
			)
			.catch((r) => {
				const _r = r as RequestError;
				const msg = `${_r.status} ${_r.message}`;
				enqueueSnackbar(msg, {
					variant: "error",
				});
			});
	};

	return (
		<WithAppBar
			location={repo.name}
			seconadaryNav={
				<Button
					disableElevation
					size="small"
					variant="outlined"
					startIcon={<SyncRounded />}
					onClick={handleSyncReadme}
				>
					Sync
				</Button>
			}
		>
			<Container maxWidth="sm">
				<Stack marginY={2}>
					{repo.topics !== undefined && (
						<Stack
							display="flex"
							flexWrap="wrap"
							width="75%"
							flexDirection="row"
							gap={1}
						>
							{repo.topics.map((topic) => (
								<Paper
									key={topic}
									variant="outlined"
									sx={{
										padding: 0.7,
										borderRadius: 2,
									}}
								>
									<Typography
										component={RouterLink}
										to={{
											pathname: "/",
											search: createSearchParams({
												topics: [topic],
											}).toString(),
										}}
									>
										{topic}
									</Typography>
								</Paper>
							))}
						</Stack>
					)}
					<Typography
						id="preview"
						maxWidth="100%"
						height="100%"
						overflow="auto"
						display="block"
						sx={{
							wordBreak: "break-word",
							wordWrap: "break-word",
							scrollbarWidth: "thin",
						}}
					/>
				</Stack>
			</Container>
		</WithAppBar>
	);
};
