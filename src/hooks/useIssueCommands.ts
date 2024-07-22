import { openLink } from "~tauri/path";
import { CommandOption } from "~types/generic";
import { AppIssue } from "~types/models";

export const useIssueCommands = (
	issue: AppIssue,
) => {
	const commands: CommandOption[] = [
		{
			label: "Reveal issue on GitHub",
			system: true,
			searchTokens: [],
			action: () => openLink(issue.html_url),
		},
		{
			label: "Mark issue as ...",
			description: "To be implemented",
			system: true,
			searchTokens: [],
			action: () => {},
		},
		{
			label: "Add comment",
			description: "To be implemented",
			system: true,
			searchTokens: [],
			action: () => {},
		},
		{
			label: "Close issue",
			description: "To be implemented",
			system: true,
			searchTokens: [],
			action: () => {},
		},
		{
			label: "Reopen issue",
			description: "To be implemented",
			system: true,
			searchTokens: [],
			action: () => {},
		},
	];
	return commands;
};
