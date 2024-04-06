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

	const contentRef = useRef<HTMLElement | null>(
		null,
	);

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
			maxWidth="100%"
			height="100%"
			overflow="auto"
			display="block"
			sx={{
				...sx,
				wordBreak: "break-word",
				wordWrap: "break-word",
			}}
		>
			{emptyText}
		</Typography>
	);
};
