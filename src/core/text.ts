import rehypeDocument from "rehype-document";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import {
	CommentSchema,
	IssueSchema,
	RepoSchema,
} from "~types/schema";
import { normalizeDateString } from "./time";

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

export const parseMarkdown = (
	content: string,
) => {
	return unified()
		.use(remarkParse, {
			fragment: true,
		})
		.use(remarkGfm)
		.use(remarkMath)
		.use(remarkRehype)
		.use(rehypeSanitize)
		.use(rehypeKatex)
		.use(rehypeDocument, {
			css: "https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css",
		})
		.use(rehypeStringify)
		.processSync(content.normalize())
		.toString()
		.replace(
			`<table`,
			`<div style='display: block; width: 100%; overflow-x: auto'><table`,
		)
		.replace(`</table>`, `</table></div>`);
};
