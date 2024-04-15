import {
	Typography,
	TypographyProps,
} from "@mui/material";
import { FC, useEffect, useRef } from "react";
import { parseMarkdown } from "~core/markdown";

type MarkdownProps = Omit<
	TypographyProps,
	"ref"
> & {
	markdownContent: string | undefined | null;
	emptyText: string | undefined;
};
export const Markdown: FC<MarkdownProps> = (
	props,
) => {
	const {
		markdownContent: content,
		emptyText,
		sx,
		...rest
	} = props;

	const contentRef =
		useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (
			content === undefined ||
			content === null ||
			contentRef === null ||
			contentRef.current === null
		) {
			return;
		}
		const innerHtml = parseMarkdown(content);
		contentRef.current.innerHTML = innerHtml;
	}, [content]);

	return (
		<Typography
			{...rest}
			ref={contentRef}
			component="div"
			display="block"
			width="100%"
			sx={{
				...sx,
				overflowX: "auto",
				fontFamily: "IBM Plex Serif",
				wordBreak: "break-word",
				wordWrap: "break-word",
			}}
		>
			{emptyText}
		</Typography>
	);
};
