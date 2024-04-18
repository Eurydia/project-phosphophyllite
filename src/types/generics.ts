import { ReactNode } from "react";

export interface SortRule<T> {
	value: string;
	label: string;
	compareFn: (a: T, b: T) => number;
}

export type GenericSelectOptions<T> = {
	label: string;
	value: T;
};

export type GenericDataCell<T> = {
	id: keyof T;
	label: string;
	render: (item: T) => ReactNode;
};
