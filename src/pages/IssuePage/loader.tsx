import { LoaderFunction } from "react-router";
import {
	getCommentsInIssue,
	getIssueInRepositoryWithNumber,
	getIssuesInRepository,
	getRepositoryWithFullName,
} from "~tauri/db/get";
import {
	AppComment,
	AppIssue,
	AppRepository,
} from "~types/models";

export type IssuePageLoaderData = {
	repository: AppRepository;
	currentIssue: AppIssue;
	comments: AppComment[];
	issues: AppIssue[];
};
export const issuePageLoader: LoaderFunction =
	async ({ params }) => {
		const { ownerName, repoName, issueNumber } =
			params;

		if (
			ownerName === undefined ||
			repoName === undefined ||
			issueNumber === undefined
		) {
			throw new Response("", {
				status: 400,
				statusText: "Bad request",
			});
		}

		const repoFullName = `${ownerName}/${repoName}`;
		const repository =
			await getRepositoryWithFullName(
				repoFullName,
			);
		if (repository === null) {
			throw new Response("", {
				status: 404,
				statusText: "Repository not",
			});
		}

		const currentIssue =
			await getIssueInRepositoryWithNumber(
				repository.url,
				issueNumber,
			);
		if (currentIssue === null) {
			throw new Response("", {
				status: 404,
				statusText: "Issue not found",
			});
		}
		const issues = await getIssuesInRepository(
			repository.url,
		);
		const comments = await getCommentsInIssue(
			currentIssue.url,
		);
		const data: IssuePageLoaderData = {
			currentIssue,
			issues,
			repository,
			comments,
		};
		return data;
	};
