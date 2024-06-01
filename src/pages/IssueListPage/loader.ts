import { LoaderFunction } from "react-router-dom";
import { getCachedIssues } from "resources/cached";
import { IssueSchema } from "~types/schema";

export type LoaderData = {
	issues: IssueSchema[];
};
export const loader: LoaderFunction =
	async () => {
		const issues = (
			await getCachedIssues()
		).filter(
			({ ownerType }) => ownerType === "User",
		);
		const loaderData: LoaderData = {
			issues,
		};
		return loaderData;
	};
