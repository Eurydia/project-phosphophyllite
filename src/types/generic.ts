export type CommandOption = {
	label: string;
	action: () => void;
	description?: string | null;
	system?: boolean;
	disabled?: boolean;
};
