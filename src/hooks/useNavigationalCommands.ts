import { useSubmit } from "react-router-dom";
import { CommandOption } from "~types/generic";
import { AppRepository } from "~types/models";

const tokenizeAppRepository = (
	repository: AppRepository,
): string[] => {
	const tokens: string[] = [];
	tokens.push(repository.owner_login);
	tokens.push(repository.name);
	tokens.push(
		repository.private ? "private" : "public",
	);
	tokens.push(
		repository.archived ? "archived" : "active",
	);
	return tokens;
};

export const useNavigationalCommands = (
	repositories: AppRepository[],
) => {
	const submit = useSubmit();

	const goToRepository = (
		repository: AppRepository,
	) =>
		submit(
			{},
			{
				action: `/${repository.full_name}`,
			},
		);

	const commands: CommandOption[] = [
		{
			label: "/",
			action: () => submit({}, { action: "/" }),
			searchTokens: ["home", "root"],
		},
	];

	for (const repository of repositories) {
		const label = `/${repository.full_name}`;
		const searchTokens =
			tokenizeAppRepository(repository);
		commands.push({
			label,
			searchTokens,
			action: () => goToRepository(repository),
		});
	}

	return commands;
};
