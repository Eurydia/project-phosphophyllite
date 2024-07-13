import { useTheme } from "@mui/material";
import { createTheme } from "@uiw/codemirror-themes";
import { useRef } from "react";

export const useEditorTheme = () => {
	const theme = useTheme();

	const editorTheme = useRef(
		createTheme({
			theme: "dark",
			settings: {
				background:
					theme.palette.background.default,
				lineHighlight: theme.palette.action.hover,
				caret: theme.palette.primary.main,
				gutterBackground:
					theme.palette.background.default,
				gutterForeground:
					theme.palette.text.primary,
				fontSize: theme.typography.fontWeightBold,
				selection: theme.palette.action.selected,
				selectionMatch:
					theme.palette.action.selected,
			},
			styles: [],
		}),
	);
	return editorTheme.current;
};
