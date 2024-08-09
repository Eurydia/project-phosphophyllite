import { useSubmit } from "react-router-dom";
import { openLink } from "~tauri/open";
import { CommandOption } from "~types/generic";
import {
	AppIssue,
	AppRepository,
} from "~types/models";
import { useAddIssue } from "./useAddIssue";
import { useUpdateRespositoryReadme } from "./useUpdateRepositoryReadme";

const tokenizeAppIssue = (
	issue: AppIssue,
): string[] => {
	const tokens = ["issue"];
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
	const updateReadme =
		useUpdateRespositoryReadme();
	const addIssue = useAddIssue();

	const submit = useSubmit();

	const goToIssue = (issue: AppIssue) =>
		submit(
			{},
			{
				action: `/${repository.full_name}/${issue.number}`,
			},
		);

	const disabled = repository.archived;
	const description = disabled
		? "Only available for active repositories"
		: null;

	const commands: CommandOption[] = [
		{
			label: "Reveal repository on GitHub",
			system: true,
			action: () => openLink(repository.html_url),
			searchTokens: [],
		},
		{
			label:
				"PROJECT: Add repository to project ...",
			description: "To be implemented",
			system: true,
			searchTokens: [],
			action: () => {},
		},
		{
			label: "Edit repository README",
			system: true,
			action: () => updateReadme(repository),
			disabled,
			description,
			searchTokens: [],
		},
		{
			label: "Add issue",
			system: true,
			action: () => addIssue(repository),
			disabled,
			description,
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
