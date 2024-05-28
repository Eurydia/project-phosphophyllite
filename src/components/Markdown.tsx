import { Typography } from "@mui/material";
import { FC, useEffect, useRef } from "react";
import { parseMarkdown } from "~core/markdown";

type MarkdownProps = {
	markdownContent: string | undefined | null;
	emptyText?: string | undefined;
};
export const Markdown: FC<MarkdownProps> = (
	props,
) => {
	const { markdownContent, emptyText } = props;

	const contentRef =
		useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (
			markdownContent === undefined ||
			markdownContent === null ||
			contentRef === null ||
			contentRef.current === null
		) {
			return;
		}
		const innerHtml = parseMarkdown(
			markdownContent,
		);
		contentRef.current.innerHTML = innerHtml;
	}, [markdownContent]);

	return (
		<Typography
			ref={contentRef}
			width="100%"
			fontFamily="IBM Plex Serif"
			whiteSpace="wrap"
			sx={{ wordBreak: "break-word" }}
		>
			{emptyText}
		</Typography>
	);
};
