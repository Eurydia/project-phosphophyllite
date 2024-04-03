import { Box, Grid } from "@mui/material";
import {
	FC,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";

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
			`calc(98vh - ${Math.floor(topOffset)}px)`,
		);
	}, [contentRef]);

	return (
		<Box
			ref={contentRef}
			paddingTop={2}
			marginLeft={2}
		>
			<Grid
				container
				spacing={2}
			>
				{isEditMode && (
					<Grid
						item
						md={6}
						height={contentHeight}
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
