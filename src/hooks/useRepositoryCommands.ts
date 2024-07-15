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
		const _commands: CommandOption[] = [
			{
				label: "Reveal repository on GitHub",
				system: true,
				action: () =>
					openLink(repository.html_url),
			},
			{
				label: "Mark repository as ...",
				system: true,
				action: () => {},
			},
			{
				label: "Add issue",
				system: true,
				action: () => {},
			},
		];
		for (const issue of issues) {
			_commands.push({
				label: `Issue #${issue.number} ${issue.title}`,
				description: `~/${repository.full_name}/issue/${issue.number}`,
				action: () =>
					submit(
						{},
						{
							action: `/${repository.full_name}/${issue.number}`,
						},
					),
			});
		}
		return _commands;
	}, [repository.url]);
	return commands;
};
