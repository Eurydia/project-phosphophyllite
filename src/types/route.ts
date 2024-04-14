import { ReactNode } from "react";

export type Route = {
	name: string;
	relativePath: string;
	element: ReactNode;
};
