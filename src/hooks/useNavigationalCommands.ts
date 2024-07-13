import { useMemo } from "react";
import { useSubmit } from "react-router-dom";
import { CommandOption } from "~types/generic";
import { AppRepository } from "~types/models";

export const useNavigationalCommands = (
	repositories: AppRepository[],
) => {
	const submit = useSubmit();
	const commands = useMemo(() => {
		const _commands: CommandOption[] = [
			{
				label: "~",
				action: () => submit({}, { action: "/" }),
			},
		];
		for (const repository of repositories) {
			_commands.push({
				label: `~/${repository.full_name}`,
				action: () =>
					submit(
						{},
						{
							action: `/${repository.full_name}`,
						},
					),
			});
		}

		return _commands;
	}, [repositories]);

	return commands;
};
