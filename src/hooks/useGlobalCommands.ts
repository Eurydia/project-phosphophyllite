import { useEffect, useRef } from "react";
import { useSubmit } from "react-router-dom";
import {
	openConfigFile,
	openSecretDir,
} from "~api/open";
import { getRepositories } from "~database/get";
import { CommandOption } from "~types/generic";
import { useUpdateDB } from "./useUpdateDB";

export const useGlobalCommands = () => {
	const submit = useSubmit();
	const updateDB = useUpdateDB();
	const hasRegistratered = useRef(false);

	const { current: commands } = useRef<
		CommandOption[]
	>([]);

	useEffect(() => {
		if (hasRegistratered.current) {
			return;
		}
		hasRegistratered.current = true;

		commands.push(
			...[
				{
					label: "Reveal config file",
					action: () => openConfigFile(),
					description: null,
					system: true,
				},
				{
					label: "Reveal credential directory",
					action: () => openSecretDir(),
					description: null,
					system: true,
				},
				{
					label: "Update database",
					action: updateDB,
					description: null,
					system: true,
				},
				{
					label: "Go to ~",
					action: () =>
						submit({}, { action: "/" }),
					description: null,
					system: false,
				},
			],
		);
		(async () => {
			const repos = await getRepositories();
			for (const repo of repos) {
				commands.push({
					label: `Go to ~/${repo.full_name}`,
					action: () =>
						submit(
							{},
							{
								action: `/${repo.full_name}`,
							},
						),
				});
			}
		})();
	}, []);

	return commands;
};
