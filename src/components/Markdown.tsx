import { Typography } from "@mui/material";
import { FC, useEffect, useRef } from "react";
import { parseMarkdown } from "~core/parsing";

type MarkdownProps = {
	markdownContent: string | undefined | null;
	emptyText?: string | undefined;
};
export const Markdown: FC<MarkdownProps> = (
	props,
) => {
	const { markdownContent, emptyText } = props;

	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		(async () => {
			if (
				markdownContent === undefined ||
				markdownContent === null ||
				ref === null ||
				ref.current === null
			) {
				return;
			}
			const parsedHtml = parseMarkdown(
				markdownContent,
			);
			ref.current.innerHTML = parsedHtml;
		})();
	}, [markdownContent]);

	return (
		<Typography
			ref={ref}
			width="100%"
			fontFamily="IBM Plex Serif"
			whiteSpace="wrap"
			sx={{ wordBreak: "break-word" }}
		>
			{emptyText}
		</Typography>
	);
};
