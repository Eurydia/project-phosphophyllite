import { useMemo } from "react";
import { useSubmit } from "react-router-dom";
import { singalOpenHref } from "~signals/open";
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
	const commands = useMemo<
		CommandOption[]
	>(() => {
		const comms: CommandOption[] = [
			{
				label: "Reveal repository on GitHub",
				action: () =>
					singalOpenHref(repository.html_url),
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
				label: "Edit readme file",
				action: () => {},
			},
		];
		for (const issue of issues) {
			comms.push({
				label: `Go to ${issue.title} (Issue #${issue.number})`,
				action: () =>
					submit(
						{},
						{
							action: `/${repository.full_name}/${issue.number}`,
						},
					),
			});
		}
		return comms;
	}, [repository.url]);
	return commands;
};
