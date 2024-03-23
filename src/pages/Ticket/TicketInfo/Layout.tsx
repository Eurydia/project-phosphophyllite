import {
	FC,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { Box, Grid } from "@mui/material";

type LayoutPros = {
	slotEditor: ReactNode;
	slotPreview: ReactNode;
	isEditMode: boolean;
};
export const Layout: FC<LayoutPros> = (props) => {
	const { isEditMode, slotEditor, slotPreview } =
		props;

	const contentRef =
		useRef<HTMLDivElement | null>(null);
	const [contentHeight, setEditorHeight] =
		useState("");
	useEffect(() => {
		if (!contentRef || !contentRef.current) {
			return;
		}
		const topOffset =
			contentRef.current.offsetTop;
		setEditorHeight(
			`calc(100vh - ${topOffset}px)`,
		);
	}, [contentRef]);

	return (
		<Box
			ref={contentRef}
			overflow="hidden"
		>
			<Grid
				container
				spacing={2}
				paddingTop={2}
			>
				{isEditMode && (
					<Grid
						height={contentHeight}
						item
						md={6}
					>
						{slotEditor}
					</Grid>
				)}
				<Grid
					item
					md
					height={contentHeight}
					overflow="auto"
				>
					{slotPreview}
				</Grid>
			</Grid>
		</Box>
	);
};
