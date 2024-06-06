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
import { CommentSchema } from "~types/schema";
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
