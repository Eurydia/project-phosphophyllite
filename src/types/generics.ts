export interface SortRule<T> {
	value: string;
	label: string;
	compareFn: (a: T, b: T) => number;
}
