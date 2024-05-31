import { Buffer } from "buffer";
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

export const decodeBase64 = (content: string) => {
	if (content === "") {
		return "";
	}
	const decoded = Buffer.from(
		content,
		"base64",
	).toString();
	return decoded;
};

export const commentToMetadata = (
	comment: CommentSchema,
): string => {
	const normCreated = normalizeDateString(
		comment.createdAt,
	);
	const normUpdated = normalizeDateString(
		comment.updatedAt,
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
		issue.createdAt,
		"Unknown",
	);
	const normClosed = normalizeDateString(
		issue.closedAt,
		"Never",
	);
	const normUpdated = normalizeDateString(
		issue.updatedAt,
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
		repo.createdAt,
		"Unknown",
	);
	const normUpdated = normalizeDateString(
		repo.updatedAt,
		"Never",
	);
	const normPushed = normalizeDateString(
		repo.pushedAt,
		"Never",
	);
	const desc =
		repo.description ??
		"This repository does not have a description";
	const status = repo.status
		? "Archived"
		: "Active";
	const visibility = repo.visibility
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
