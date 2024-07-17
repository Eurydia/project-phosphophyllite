import { useSnackbar } from "notistack";
import { useRef } from "react";
import {
	openConfigFile,
	openSecretDir,
} from "~tauri/path";
import { CommandOption } from "~types/generic";
import { useUpdateDB } from "./useUpdateDB";

export const useSystemCommands = () => {
	const updateDB = useUpdateDB();
	const { closeSnackbar } = useSnackbar();

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
		{
			label: "Clear all notifications",
			action: closeSnackbar,
			system: true,
		},
	]);

	return commands.current;
};
