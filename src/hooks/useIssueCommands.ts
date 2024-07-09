import { useMemo } from "react";
import { singalOpenHref } from "~signals/open";
import { CommandOption } from "~types/generic";
import { AppIssue } from "~types/models";

export const useIssueCommands = (
	issue: AppIssue,
) => {
	const commands = useMemo<
		CommandOption[]
	>(() => {
		const comms: CommandOption[] = [
			{
				label: "Reveal issue on GitHub",
				action: () =>
					singalOpenHref(issue.html_url),
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
