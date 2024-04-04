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
	content: string | undefined;
	emptyText: string | undefined;
};
export const Markdown: FC<MarkdownProps> = (
	props,
) => {
	const { content, emptyText, sx, ...rest } =
		props;

	const contentRef = useRef<HTMLElement | null>(
		null,
	);

	useEffect(() => {
		if (
			content === undefined ||
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
				scrollbarWidth: "thin",
			}}
		>
			{emptyText}
		</Typography>
	);
};
