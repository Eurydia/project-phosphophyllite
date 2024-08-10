import { useRef } from "react";
import { toast } from "react-toastify";
import { tryParseJSON } from "~core/parsing";
import { getIssues } from "~tauri/db/get";
import { tauriPatchIssue } from "~tauri/github/patch";
import { openInEditor } from "~tauri/open";
import {
	createTempFile,
	deleteTempFile,
} from "~tauri/temp";
import { AppIssue } from "~types/models";
import { useAnimateToast } from "./useAnimateToast";

export const usePatchIssue = (
	issue: AppIssue,
) => {
	const isBusy = useRef(false);

	const [startAnimation, stopAnimation] =
		useAnimateToast();

	const patchIssue = async (
		ownerName: string,
		repositoryName: string,
	) => {
		if (isBusy.current) {
			toast.warn("Already patching issue");
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
					issue.issue_labels.split(","),
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
			labels: issue.issue_labels.split(","),
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
				toast.error(error);
				return null;
			},
		);

		await deleteTempFile(schemaFileName);

		if (content === null) {
			isBusy.current = false;
			return;
		}

		startAnimation("Patching issue");

		await tauriPatchIssue(
			ownerName,
			repositoryName,
			issue.number,
			content.title,
			content.labels,
			content.state,
		).then(
			() => toast.success("Patched issue"),
			(error: string) => toast.error(error),
		);
		stopAnimation();
		isBusy.current = false;
	};

	return patchIssue;
};
