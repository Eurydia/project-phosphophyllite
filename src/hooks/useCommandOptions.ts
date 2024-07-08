import { useEffect, useRef } from "react";
import { useSubmit } from "react-router-dom";
import { getRepositories } from "~database/get";
import {
	signalOpenSecretDir,
	singalOpenSettingFile,
} from "~signals/open";
import { CommandOption } from "~types/generic";

export const useCommandsOptions = () => {
	const submit = useSubmit();
	const loaded = useRef(false);

	const { current: commands } = useRef<
		CommandOption[]
	>([
		{
			label: "Open:path settings",
			action: () => singalOpenSettingFile(),
			description: null,
		},
		{
			label: "Open:path secret directory",
			action: () => signalOpenSecretDir(),
			description: null,
		},
	]);

	useEffect(() => {
		if (loaded.current) {
			return;
		}
		loaded.current = true;

		commands.push({
			label: "~",
			action: () => submit({}, { action: "/" }),
			description: null,
		});

		getRepositories().then((repos) =>
			repos.forEach((repo) =>
				commands.push({
					label: `~/repo/${repo.full_name}`,
					action: () =>
						submit(
							{},
							{
								action: `/repo/${repo.full_name}`,
							},
						),
				}),
			),
		);
	}, []);

	return commands;
};
