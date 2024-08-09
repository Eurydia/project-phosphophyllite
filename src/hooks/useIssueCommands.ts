import { openLink } from "~tauri/open";
import { CommandOption } from "~types/generic";
import {
	AppIssue,
	AppRepository,
} from "~types/models";
import { usePatchIssue } from "./usePatchIssue";
import { useSystemCommands } from "./useSystemCommands";

export const useIssuePageCommands = (
	repository: AppRepository,
	currentIssue: AppIssue,
	otherIssues: AppIssue[],
) => {
	const systemCommands = useSystemCommands();
	const patchIssue = usePatchIssue(currentIssue);

	const commands: CommandOption[] = [
		...systemCommands,
		{
			label: "Reveal issue on GitHub",
			system: true,
			searchTokens: [],
			action: () =>
				openLink(currentIssue.html_url),
		},
		{
			label: "Add comment",
			description: "To be implemented",
			system: true,
			searchTokens: [],
			action: () => {},
		},
		{
			label: "Patch issue",
			system: true,
			searchTokens: [
				"edit",
				"update",
				"labels",
				"label",
				"title",
				"state",
			],
			action: () =>
				patchIssue(
					repository.owner_login,
					repository.name,
				),
		},
		// {
		// 	label: "Mark issue as ...",
		// 	description: "To be implemented",
		// 	system: true,
		// 	searchTokens: [],
		// 	action: () => {},
		// },
		// {
		// 	label: "Close issue",
		// 	description: "To be implemented",
		// 	system: true,
		// 	searchTokens: [],
		// 	action: () => {},
		// },
		// {
		// 	label: "Reopen issue",
		// 	description: "To be implemented",
		// 	system: true,
		// 	searchTokens: [],
		// 	action: () => {},
		// },
	];
	return commands;
};
