import { useSnackbar } from "notistack";
import {
	openConfigFile,
	openSecretDir,
} from "~tauri/path";
import { CommandOption } from "~types/generic";
import { useUpdateDB } from "./useUpdateDB";

export const useSystemCommands = () => {
	const updateDB = useUpdateDB();
	const { closeSnackbar } = useSnackbar();

	const commands: CommandOption[] = [
		{
			label: "Reveal config file",
			system: true,
			searchTokens: [],
			action: openConfigFile,
		},
		{
			label: "Reveal credential directory",
			system: true,
			searchTokens: [],
			action: openSecretDir,
		},
		{
			label: "Update database",
			system: true,
			searchTokens: [],
			action: updateDB,
		},
		{
			label: "Clear all notifications",
			system: true,
			searchTokens: [],
			action: closeSnackbar,
		},
	];

	return commands;
};
