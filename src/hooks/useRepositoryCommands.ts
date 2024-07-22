import { useSubmit } from "react-router-dom";
import { openLink } from "~tauri/path";
import { CommandOption } from "~types/generic";
import {
	AppIssue,
	AppRepository,
} from "~types/models";

const tokenizeAppIssue = (
	issue: AppIssue,
): string[] => {
	const tokens: string[] = [];
	tokens.push(issue.title);
	tokens.push(issue.user_type);
	tokens.push(issue.state);
	tokens.push(issue.number.toString());
	return tokens;
};

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
			searchTokens: [],
		},
	];
	for (const issue of issues) {
		const label = `Issue #${issue.number} ${issue.title}`;
		const description = `~/${repository.full_name}/issue/${issue.number}`;
		const searchTokens = tokenizeAppIssue(issue);

		commands.push({
			label,
			description,
			searchTokens,
			action: () => goToIssue(issue),
		});
	}
	return commands;
};
