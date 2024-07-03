// import { LoaderFunction } from "react-router";
// import { Comment, Issue } from "~types/schema";

// export type LoaderData = {
// 	issue: Issue;
// 	comments: Comment[];
// };
// export const loader: LoaderFunction = async ({
// 	params,
// }) => {
// 	const owner = params.owner;
// 	const repoName = params.repo;
// 	const issueNumber = params.issueNumber;
// 	const _issueNumber = Number.parseInt(
// 		issueNumber ?? "",
// 	);
// 	const fullName = `${owner}/${repoName}`;
// 	const issue = (
// 		await getCachedIssues(fullName, _issueNumber)
// 	)[0];
// 	const comments = await getCachedComments(
// 		issue.id,
// 	);
// 	const loaderData: LoaderData = {
// 		issue,
// 		comments,
// 	};
// 	return loaderData;
// };
