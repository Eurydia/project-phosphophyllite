import { useSubmit } from "react-router-dom";
import { openLink } from "~tauri/path";
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

	const goToIssue = (issue: AppIssue) =>
		submit(
			{},
			{
				action: `/${repository.full_name}/${issue.number}`,
			},
		);

	const commands: CommandOption[] = [
		{
			label: "Reveal repository on GitHub",
			system: true,
			action: () => openLink(repository.html_url),
		},
	];
	for (const issue of issues) {
		commands.push({
			label: `Issue #${issue.number} ${issue.title}`,
			description: `~/${repository.full_name}/issue/${issue.number}`,
			action: () => goToIssue(issue),
		});
	}
	return commands;
};
