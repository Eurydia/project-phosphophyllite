import { FC } from "react";
import {
	Editor,
	EditorProps,
	loader,
} from "@monaco-editor/react";
import { themeComposed } from "theme";

const editorLoader = await loader.init();
editorLoader.editor.defineTheme("markdown-dark", {
	base: "vs-dark",
	inherit: true,
	rules: [
		{
			background: "272822",
			token: "",
		},
		{
			foreground: "75715e",
			token: "comment",
		},
		{
			foreground: "e6db74",
			token: "string",
		},
		{
			foreground: "ae81ff",
			token: "constant.numeric",
		},
		{
			foreground: "ae81ff",
			token: "constant.language",
		},
		{
			foreground: "ae81ff",
			token: "constant.character",
		},
		{
			foreground: "ae81ff",
			token: "constant.other",
		},
		{
			foreground: "f92672",
			token: "keyword",
		},
		{
			foreground: "f92672",
			token: "storage",
		},
		{
			foreground: "66d9ef",
			fontStyle: "italic",
			token: "storage.type",
		},
		{
			foreground: "a6e22e",
			fontStyle: "underline",
			token: "entity.name.class",
		},
		{
			foreground: "a6e22e",
			fontStyle: "italic underline",
			token: "entity.other.inherited-class",
		},
		{
			foreground: "a6e22e",
			token: "entity.name.function",
		},
		{
			foreground: "fd971f",
			fontStyle: "italic",
			token: "variable.parameter",
		},
		{
			foreground: "f92672",
			token: "entity.name.tag",
		},
		{
			foreground: "a6e22e",
			token: "entity.other.attribute-name",
		},
		{
			foreground: "66d9ef",
			token: "support.function",
		},
		{
			foreground: "66d9ef",
			token: "support.constant",
		},
		{
			foreground: "66d9ef",
			fontStyle: "italic",
			token: "support.type",
		},
		{
			foreground: "66d9ef",
			fontStyle: "italic",
			token: "support.class",
		},
		{
			foreground: "f8f8f0",
			background: "f92672",
			token: "invalid",
		},
		{
			foreground: "f8f8f0",
			background: "ae81ff",
			token: "invalid.deprecated",
		},
		{
			foreground: "cfcfc2",
			token:
				"meta.structure.dictionary.json string.quoted.double.json",
		},
		{
			foreground: "75715e",
			token: "meta.diff",
		},
		{
			foreground: "75715e",
			token: "meta.diff.header",
		},
		{
			foreground: "f92672",
			token: "markup.deleted",
		},
		{
			foreground: "a6e22e",
			token: "markup.inserted",
		},
		{
			foreground: "e6db74",
			token: "markup.changed",
		},
		{
			foreground: "ae81ffa0",
			token:
				"constant.numeric.line-number.find-in-files - match",
		},
		{
			foreground: "e6db74",
			token: "entity.name.filename.find-in-files",
		},
	],
	colors: {
		"editor.background":
			themeComposed.palette.background.default,
	},
});
editorLoader.editor.setTheme("markdown-dark");

export const StyledEditor: FC<EditorProps> = (
	props,
) => {
	return (
		<Editor
			{...props}
			language="markdown"
			defaultLanguage="markdown"
			theme="markdown-dark"
			options={{
				minimap: { enabled: false },
				wordWrap: "on",
				wordBreak: "normal",
				folding: false,
				fontSize: 18,
				fontFamily: "Fira Code",
				fontLigatures: true,
			}}
		/>
	);
};
