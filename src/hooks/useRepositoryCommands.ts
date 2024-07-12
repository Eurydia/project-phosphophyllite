import { useMemo } from "react";
import { useSubmit } from "react-router-dom";
import { openLink } from "~tauri/open";
import { CommandOption } from "~types/generic";
import {
	AppIssue,
	AppRepository,
} from "~types/models";

export const useRepositoryCommands = (
	repository: AppRepository,
	issues: AppIssue[],
) => {
	const submit = useSubmit();
	const commands = useMemo(() => {
		const comms: CommandOption[] = [
			{
				label: "Reveal repository on GitHub",
				action: () =>
					openLink(repository.html_url),
			},
			{
				label: "Mark repository as ...",
				action: () => {},
			},
			{
				label: "Add issue",
				action: () => {},
			},
			{
				label: "Edit readme",
				action: () =>
					submit(
						{ editing: true },
						{
							action: `/${repository.full_name}/readme`,
						},
					),
			},
		];
		for (const issue of issues) {
			comms.push({
				label: `Go to ${issue.title}`,
				action: () =>
					submit(
						{},
						{
							action: `/${repository.full_name}/${issue.number}`,
						},
					),
				description: `Issue #${issue.number} ${issue.state}`,
			});
		}
		return comms;
	}, [repository.url]);
	return commands;
};
