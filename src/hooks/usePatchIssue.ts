import { useSnackbar } from "notistack";
import { useRef } from "react";
import { tryParseJSON } from "~core/parsing";
import { getIssues } from "~tauri/db/get";
import { patchIssue } from "~tauri/github/patch";
import { openInEditor } from "~tauri/open";
import {
	createTempFile,
	deleteTempFile,
} from "~tauri/temp";
import { AppIssue } from "~types/models";

export const usePatchIssue = (
	issue: AppIssue,
) => {
	const { closeSnackbar, enqueueSnackbar } =
		useSnackbar();

	const isBusy = useRef(false);

	const patchIssue_ = async (
		ownerName: string,
		repositoryName: string,
	) => {
		if (isBusy.current) {
			enqueueSnackbar(
				"Already patching issue...",
				{
					variant: "error",
				},
			);
			return;
		}

		isBusy.current = true;

		const fileName = `issue_metadata_${ownerName}_${repositoryName}_number_${issue.number}`;
		const tempFileName = `${fileName}.json`;
		const schemaFileName = `${fileName}.schema.json`;

		const issues = await getIssues();
		const unique_labels = new Set(
			issues
				.map((issue) =>
					issue.issue_label.split(","),
				)
				.flat(),
		);
		const labels = Array.from(unique_labels);

		const schema = {
			$schema:
				"https://json-schema.org/draft/2020-12/schema",
			type: "object",
			properties: {
				title: {
					type: "string",
				},
				labels: {
					type: "array",
					items: {
						type: "string",
						enum: labels,
					},
				},
				state: {
					type: "string",
					enum: ["open", "closed"],
				},
			},
		};

		const initContent = {
			$schema: `./${schemaFileName}`,
			title: issue.title,
			labels: issue.issue_label.split(","),
			state: issue.state,
		};

		await createTempFile(
			schemaFileName,
			JSON.stringify(schema),
		);

		const content = await openInEditor(
			tempFileName,
			JSON.stringify(initContent, null, 2),
		).then(
			(result) =>
				tryParseJSON<
					{
						title: string;
						labels: string[];
						state: string;
					},
					null
				>(result, null),
			(error: string) => {
				enqueueSnackbar(error, {
					variant: "error",
					persist: true,
				});
				return null;
			},
		);

		await deleteTempFile(schemaFileName);

		if (content === null) {
			isBusy.current = false;
			return;
		}

		const id = enqueueSnackbar(
			"Patching issue...",
			{
				variant: "info",
				persist: true,
			},
		);
		await patchIssue(
			ownerName,
			repositoryName,
			issue.number,
			content.title,
			content.labels,
			content.state,
		).then(
			() =>
				enqueueSnackbar("Patched issue", {
					variant: "success",
				}),
			(error: string) =>
				enqueueSnackbar(error, {
					variant: "error",
					persist: true,
				}),
		);
		closeSnackbar(id);
		isBusy.current = false;
	};

	return patchIssue_;
};
