import {
	CommentSchema,
	IssueSchema,
	RepoSchema,
} from "~types/schemas";
import { normalizeDateString } from "./time";

export const quantityAwareText = (
	amount: number,
	singular: string,
	plural: string,
) => {
	if (amount > 1) {
		return plural;
	}
	return singular;
};

export const commentToMetadata = (
	comment: CommentSchema,
): string => {
	const normCreated = normalizeDateString(
		comment.created_at,
	);
	const normUpdated = normalizeDateString(
		comment.updated_at,
	);
	const updatedMsg = `Last updated: ${normUpdated}`;
	const createdMsg = `Created: ${normCreated}`;

	const metadata = `
${createdMsg}
${updatedMsg}`;
	return metadata;
};

export const issueToMetadata = (
	issue: IssueSchema,
): string => {
	const normCreated = normalizeDateString(
		issue.created_at,
		"Unknown",
	);
	const normClosed = normalizeDateString(
		issue.closed_at,
		"Never",
	);
	const normUpdated = normalizeDateString(
		issue.updated_at,
	);
	const createdMsg = `Created: ${normCreated}`;
	const closedMsg = `Closed: ${normClosed}`;
	const updatedMsg = `Last updated: ${normUpdated}`;

	const metadata = `
${createdMsg}
${updatedMsg}
${closedMsg}`;

	return metadata;
};

export const repoToMetadata = (
	repo: RepoSchema,
): string => {
	const normCreated = normalizeDateString(
		repo.created_at,
		"Unknown",
	);
	const normUpdated = normalizeDateString(
		repo.updated_at,
		"Never",
	);
	const normPushed = normalizeDateString(
		repo.pushed_at,
		"Never",
	);
	const desc =
		repo.description ??
		"This repository does not have a description";
	const status = repo.is_archived
		? "Archived"
		: "Active";
	const visibility = repo.is_private
		? "Private"
		: "Public";
	const statusMsg = `Status: ${status}`;
	const visibilityMsg = `Visibility: ${visibility}`;
	const descMsg = `${desc}`;
	const createdMsg = `Created: ${normCreated}`;
	const updatedMsg = `Last updated: ${normUpdated}`;
	const pushedMsg = `Last pushed: ${normPushed}`;

	const metadata = `
${descMsg}

${statusMsg} 
${visibilityMsg}

${createdMsg}
${updatedMsg}
${pushedMsg}`;
	return metadata;
};
