import { LoaderFunction } from "react-router";
import {
	getCachedComments,
	getCachedIssues,
} from "~database/cached";
import {
	CommentSchema,
	IssueSchema,
} from "~types/schemas";

export type LoaderData = {
	issue: IssueSchema;
	comments: CommentSchema[];
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
	const _issueNumber =
		Number.parseInt(issueNumber);
	if (!Number.isSafeInteger(_issueNumber)) {
		throw new Response("", {
			status: 400,
			statusText: "Bad requeset",
		});
	}

	const fullName = `${owner}/${repoName}`;
	const issue = (
		await getCachedIssues(fullName, _issueNumber)
	)[0];
	if (issue === undefined) {
		throw new Response("Not found", {
			status: 404,
			statusText:
				"Issue does not exist or it is not cached.",
		});
	}
	const comments = await getCachedComments(
		issue.id,
	);
	const loaderData: LoaderData = {
		issue,
		comments,
	};
	return loaderData;
};
