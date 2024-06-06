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
import { visit } from "unist-util-visit";

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
		.use(() => {
			return (tree) => {
				visit(tree, "element", (node) => {
					const e = node as {
						tagName: string;
						properties: Record<
							string,
							undefined | string | number
						>;
					};
					if (e.tagName === "a") {
						e.properties[
							"onclick"
						] = `window.__TAURI__.tauri.invoke("open_url", {url: "${e.properties["href"]}"})`;
						e.properties["href"] = undefined;
					}
				});
			};
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
