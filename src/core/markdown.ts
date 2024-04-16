import rehypeDocument from "rehype-document";
import rehypeKatex from "rehype-katex";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

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
