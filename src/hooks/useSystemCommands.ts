import { useSnackbar } from "notistack";
import {
	openLogDir,
	openSecretDir,
	openSettingFile,
} from "~tauri/open";
import { revertAppSettings } from "~tauri/settings";
import { CommandOption } from "~types/generic";
import { useUpdateDB } from "./useUpdateDB";

export const useSystemCommands = () => {
	const updateDB = useUpdateDB();
	const { closeSnackbar } = useSnackbar();

	const commands: CommandOption[] = [
		{
			label: "Revert settings to default",
			system: true,
			searchTokens: [],
			action: revertAppSettings,
		},
		{
			label: "Reveal settings file",
			system: true,
			searchTokens: [],
			action: openSettingFile,
		},
		{
			label: "Reveal credential directory",
			system: true,
			searchTokens: [],
			action: openSecretDir,
		},
		{
			label: "Reveal log directory",
			system: true,
			searchTokens: [],
			action: openLogDir,
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
