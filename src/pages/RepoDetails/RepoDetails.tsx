import { SyncRounded } from "@mui/icons-material";
import {
	Button,
	Container,
	Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { RequestError } from "octokit";
import { FC, useEffect } from "react";
import { useLoaderData } from "react-router";
import { useSubmit } from "react-router-dom";
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
	}, []);

	const handleSyncReadme = async () => {
		getRepoContentReadMe(repo.full_name)
			.then((readme) => syncCachedReadme(readme))
			.then(() =>
				submit(
					{},
					{
						action: ".",
						method: "get",
					},
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
			</Container>
		</WithAppBar>
	);
};
