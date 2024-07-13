import { useRef } from "react";
import {
	openConfigFile,
	openSecretDir,
} from "~tauri/open";
import { CommandOption } from "~types/generic";
import { useUpdateDB } from "./useUpdateDB";

export const useSystemCommands = () => {
	const updateDB = useUpdateDB();

	const commands = useRef<CommandOption[]>([
		{
			label: "Reveal config file",
			action: openConfigFile,
			system: true,
		},
		{
			label: "Reveal credential directory",
			action: openSecretDir,
			system: true,
		},
		{
			label: "Update database",
			action: updateDB,
			system: true,
		},
	]);

	return commands.current;
};
