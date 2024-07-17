import { useMemo } from "react";
import { openLink } from "~tauri/path";
import { CommandOption } from "~types/generic";
import { AppIssue } from "~types/models";

export const useIssueCommands = (
	issue: AppIssue,
) => {
	const commands = useMemo(() => {
		const comms: CommandOption[] = [
			{
				label: "Reveal issue on GitHub",
				action: () => openLink(issue.html_url),
			},
			{
				label: "Mark issue as ...",
				action: () => {},
			},
			{
				label: "Add comment",
				action: () => {},
			},
			{
				label: "Close issue",
				action: () => {},
			},
			{
				label: "Reopen issue",
				action: () => {},
			},
		];
		return comms;
	}, [issue.url]);
	return commands;
};
