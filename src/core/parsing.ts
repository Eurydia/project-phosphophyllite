import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

export const tryParse = (
	jsonString: string,
): unknown | null => {
	try {
		return JSON.parse(jsonString);
	} catch (err) {
		console.warn(err);
		return null;
	}
};

export const parseMarkdown = (
	markdownString: string,
): string => {
	return unified()
		.use(remarkParse, { fragment: true })
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeSanitize)
		.use(rehypeStringify)
		.parse(markdownString)
		.toString();
};
