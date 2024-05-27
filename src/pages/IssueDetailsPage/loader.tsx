import { LoaderFunction } from "react-router";
import {
	getCachedIssueComments,
	getCachedRepoIssue,
} from "~database/cached";
import {
	RepoIssueCommentSchema,
	RepoIssueSchema,
} from "~types/schemas";

export type LoaderData = {
	issue: RepoIssueSchema;
	comments: RepoIssueCommentSchema[];
};
export const loader: LoaderFunction = async ({
	params,
}) => {
	const owner = params.owner;
	const repoName = params.repo;
	const issueNumber = params.issueNumber;
	if (
		owner === undefined ||
		repoName === undefined ||
		issueNumber === undefined
	) {
		throw new Response("", {
			status: 400,
			statusText: "Bad requeset",
		});
	}
	if (
		!Number.isSafeInteger(
			Number.parseInt(issueNumber),
		)
	) {
		throw new Response("", {
			status: 400,
			statusText: "Bad requeset",
		});
	}

	const fullName = `${owner}/${repoName}`;
	const issue = await getCachedRepoIssue(
		fullName,
		Number.parseInt(issueNumber),
	);
	if (issue === undefined) {
		throw new Response("Not found", {
			status: 404,
			statusText:
				"Issue does not exist or it is not cached.",
		});
	}
	const loaderData: LoaderData = {
		issue,
		comments: await getCachedIssueComments(
			issue.id,
		),
	};

	return loaderData;
};
