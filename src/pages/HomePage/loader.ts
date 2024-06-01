import { LoaderFunction } from "react-router-dom";

export type LoaderData = {
	// recentIssues: IssueSchema[];
	// activeRepos: number;
	// archivedRepos: number;
	// openIssues: number;
	// closedIssues: number;
};
export const loader: LoaderFunction =
	async (): Promise<LoaderData> => {
		const loaderData: LoaderData = {
			// recentIssues,
			// activeRepos,
			// archivedRepos,
			// openIssues,
			// closedIssues,
		};

		return loaderData;
	};
