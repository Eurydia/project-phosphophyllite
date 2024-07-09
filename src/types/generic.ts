import { ReactNode } from "react";

export interface SortRule<T> {
	value: string;
	label: string;
	compareFn: (a: T, b: T) => number;
}

export type SelectOption<T> = {
	label: string;
	value: T;
};

export type ColumnHeader<T> = {
	id: keyof T;
	label: string;
	render: (item: T) => ReactNode;
};

export type CommandOption = {
	label: string;
	action: () => void;
	description?: string | null;
	system?: boolean;
};
